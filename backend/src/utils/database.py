import sqlite3
from typing import Any

def get_database_connection() -> sqlite3.Connection:
    conn = sqlite3.connect('example.db')
    return conn

def execute_query(query: str, params: tuple = ()) -> Any:
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    result = cursor.fetchall()
    conn.commit()
    conn.close()
    return result
