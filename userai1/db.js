// import { open } from "bun:sqlite";

import { Database } from "bun:sqlite";

const db = new Database("./b.db");
// const db = await open("example.db");

// 创建一个新表
await db.run(`
    CREATE TABLE IF NOT EXISTS stocks (
        date TEXT,
        trans TEXT,
        symbol TEXT,
        qty REAL,
        price REAL
    );
`);

// 插入一条记录
await db.run(`
    INSERT INTO stocks (date, trans, symbol, qty, price)
    VALUES (?, ?, ?, ?, ?);
`, ["2024-09-08", "BUY", "IBM", 1000, 123.45]);

// 查询所有记录
const result = await db.query(`SELECT * FROM stocks;`).all();

console.log(result); // 输出查询结果

// 关闭数据库连接
await db.close();
