"use strict";

const mssql = require('mssql');

const connString = 'Data Source=tcp:localhost,1433;Initial Catalog=mssql_test;User Id=sa;Password=Upper_l0wercase;Encrypt=true;';

describe('node-mssql-repro', () => {
    let connection;
    before('connect', async () => {
        connection = await mssql.connect(connString)
    });
    after('disconnect', async () => {
        await connection.close();
    });
    it('breaks as expected :-)', async () => {
        // works:
        console.log(await connection.query`SELECT * FROM test WHERE varcharColumn IN (${['RDG', 'RDG2']})`);
        // works:
        await connection.query`INSERT INTO test (integerColumn, varcharColumn) VALUES (${[1, 'RDG']})`;
        // breaks:
        await connection.query(`INSERT INTO test (integerColumn, varcharColumn) VALUES (${[1, 'RDG']})`);
        console.log(await connection.query`SELECT * FROM test`);
    });
});
