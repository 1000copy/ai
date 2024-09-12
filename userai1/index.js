import sqlite from "bun:sqlite";
import yaml from "js-yaml"; // 导入 YAML 解析库

// 创建数据库连接
const dbPath = "./database.db";
// const db = new sqlite.Database(dbPath, { mode: sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE });
const db = new sqlite(dbPath);
// 定义表结构
const tableSchema = `
users:
  id: integer primary key autoincrement
  name: text
  age: integer
`;

// 解析 YAML 字符串并创建表
function createTablesFromYaml(yamlContent) {
    const schema = yaml.load(yamlContent);
    Object.entries(schema).forEach(([tableName, columns]) => {
        const columnDefs = Object.keys(columns).map(columnName => {
            return `${columnName} ${columns[columnName]}`;
        }).join(", ");
        db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefs})`);
    });
}

createTablesFromYaml(tableSchema);

// 用户模型
class Model {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async create(record) {
      console.log(record)
        const columns = Object.keys(record).join(', ');
        const placeholders = Object.keys(record).map(() => '?').join(', ');
        const values = Object.values(record);
        const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
        let a = db.run(sql, values);
        console.log(a)
        return a
    }

    async read(filter) {
        const sql = `SELECT * FROM ${this.tableName}`;
        const result = db.query(sql, []).all()
        return result;
    }

    async update(updateParams) {
        const setClauses = Object.keys(updateParams).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateParams)];
        const sql = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = ?`;
        db.run(sql, [...values, updateParams.id]);
    }
    async delete(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        db.run(sql, [id]);
    }
}

class User extends Model {
    constructor() {
        super('users');
    }
}

// 处理 JSON-RPC 请求
async function handleJsonRpc(request) {
    try {
        // const { method, params, id } = request;
        // console.log(request,method,params)
        let method = request.method;
        let params = request.params;
        console.log(request,method,params)
        const ModelClass = User; // 固定使用User类

        const modelInstance = new ModelClass();
        let response = { jsonrpc: "2.0"};

        switch (method) {
            case 'users.create':
                response.result = await modelInstance.create(params);
                break;
            case 'users.read':
                response.result = await modelInstance.read(params);
                break;
            case 'users.update':
                await modelInstance.update(params);
                break;
            case 'users.delete':
                await modelInstance.delete(params.id);
                break;
            default:
                throw new Error("Method not found");
        }

        return response;
    } catch (error) {
        return { jsonrpc: "2.0", error: error.message};
    }
}

// 启动 HTTP 服务器
const BASE_PATH = "./public";
const server = Bun.serve({
    port: 3000,
    // 提供静态文件服务
      filesystem: {
          root: "./public",
      },
      // 处
    fetch(req) {
      let pathname = new URL(req.url).pathname
       console.log(pathname,req.url,req.method,req.headers.get("Content-Type"))
      if(pathname == "/"){
        const filePath = BASE_PATH + new URL(req.url).pathname+"index.html";
            const file = Bun.file(filePath);
            return new Response(file);
      }else
        // 如果请求路径是 `/api`，则处理 JSON-RPC 请求
        if (pathname.startsWith('/api')) {
            const { method, headers, body } = req;
             // console.log(body)
            if (method === "POST" && headers.get("Content-Type") === "application/json") {
              return req.text().then(async requestBody => {
                                  try {
                                      const response = await handleJsonRpc(JSON.parse(requestBody));
                                      return new Response(JSON.stringify(response), {
                                          headers: { "Content-Type": "application/json" },
                                      });
                                  } catch (error) {
                                      console.error(error);
                                      return new Response(JSON.stringify({ jsonrpc: "2.0", error: error.message, id: null }), {
                                          headers: { "Content-Type": "application/json" },
                                          status: 500,
                                      });
                                  }
                              });
            }
            return new Response("Only POST requests with JSON-RPC are supported", {
                status: 405,
            });
        }
    },
    // 默认静态文件服务
    // ...Bun.defaultServe({ root: './public' }),
});

console.log("Server running on http://localhost:3000");
