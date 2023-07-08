import { getConnection, query } from "../db";

export async function GET() {
  const connection = await getConnection();
  const sql = "SELECT * FROM list";
  const result = await query(connection, sql);
  connection.release();
  return new Response(JSON.stringify(result));
}

export async function POST(req: Request) {
  const connection = await getConnection();
  const data = await req.json();
  const sql = `INSERT INTO list (todo) VALUES ("${data.todo}")`;
  const result = (await query(connection, sql)) as any;

  const message = result?.insertId ? "success" : "error";
  const todoInfo = { id: result?.insertId, todo: data.todo };
  return new Response(JSON.stringify({ message, todoInfo }));
}

export async function DELETE(req: Request) {
  const connection = await getConnection();
  const data = await req.json();
  const sql = `DELETE FROM list WHERE id = ("${data.id}")`;
  const result = (await query(connection, sql)) as any;

  const message = result?.affectedRows ? "success" : "error";
  const todoInfo = { id: result?.id };
  return new Response(JSON.stringify({ message, todoInfo }));
}

export async function PUT(req: Request) {
  const connection = await getConnection();
  const data = await req.json();
  const sql = `
    UPDATE list
    SET todo = "${data.todo}"
    WHERE id = ${data.id};
  `;
  const result = (await query(connection, sql)) as any;

  const message = result?.affectedRows ? "success" : "error";
  const todoInfo = { id: data.id, todo: data.todo };
  return new Response(JSON.stringify({ message, todoInfo }));
}
