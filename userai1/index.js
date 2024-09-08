import Bun from 'bun';

import { Database } from "bun:sqlite";

const db = new Database("./a.db");



// 初始化表结构
await db.query(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER
)`).all();

const server = Bun.serve({
  port: 3000,
  fetch: async (request) => {
    let response;
    try {
      const { method, url } = request;
      const pathname = new URL(url).pathname
      if (pathname && pathname.startsWith('/api/users')) {
        // 处理JSON-RPC请求
        const requestBody = await request.json();
        if (!requestBody || typeof requestBody !== 'object' || !requestBody.jsonrpc || !requestBody.method) {
          throw new Error('Invalid JSON-RPC request');
        }

        const { jsonrpc, method: rpcMethod, params, id } = requestBody;
        if (jsonrpc !== '2.0') {
          throw new Error('Unsupported JSON-RPC version');
        }

        switch (rpcMethod) {
          case 'users.create':
            await createUser(params.name, params.age);
            response = new Response(JSON.stringify({
              jsonrpc: '2.0',
              result: 'User created successfully',
              id: id,
            }), { headers: { 'Content-Type': 'application/json' } });
            break;
          case 'users.read':
            const users = await readUsers(id);
            response = new Response(JSON.stringify({
              jsonrpc: '2.0',
              result: users,
              id: id,
            }), { headers: { 'Content-Type': 'application/json' } });
            break;
          case 'users.update':
            await updateUser(params.id, params.name, params.age);
            response = new Response(JSON.stringify({
              jsonrpc: '2.0',
              result: 'User updated successfully',
              id: id,
            }), { headers: { 'Content-Type': 'application/json' } });
            break;
          case 'users.delete':
            await deleteUser(params.id);
            response = new Response(JSON.stringify({
              jsonrpc: '2.0',
              result: 'User deleted successfully',
              id: id,
            }), { headers: { 'Content-Type': 'application/json' } });
            break;
          default:
            throw new Error('Method not found');
        }
      } else if (pathname == undefined || pathname === '/') {
        // 提供静态内容服务
        const fileContent = Bun.file('./public/index.html');
        response = new Response(fileContent, { headers: { 'Content-Type': 'text/html' } });
      } else {
        // 其他静态文件请求
        const fileContent = Bun.file(`./public${pathname}`);
        response = new Response(fileContent, { headers: { 'Content-Type': 'application/octet-stream' } });
      }
    } catch (error) {
      response = new Response(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: error.message,
        },
        // id: requestBody.id, // 使用可选链避免引用错误
      }), { headers: { 'Content-Type': 'application/json' }, status: 500 });
    }

    return response;
  },
});

async function createUser(name, age) {
  await db.run(`INSERT INTO users (name, age) VALUES (?, ?)`, [name, age])
}

async function readUsers(id) {
  if (id === undefined) {

    const results = await db.query(`SELECT * FROM users;`).all();
    console.log(id,`SELECT * FROM users`,results.rows)
    return results;
  } else {
    const results = await db.query(`SELECT * FROM users WHERE id=?`).all([id]);
    console.log(id,`SELECT * FROM users1`,results)
    return results;
  }
}

async function updateUser(id, name, age) {
  await db.run(`UPDATE users SET name=?, age=? WHERE id=?`, [name, age, id]);
}

async function deleteUser(id) {
  await db.run(`DELETE FROM users WHERE id=?`, [id]);
}

console.log('Server running on http://localhost:3000');
