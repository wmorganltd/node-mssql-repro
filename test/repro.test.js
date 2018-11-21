"use strict";

const mssql = require('mssql');
const { resolve } = require('mssql/lib/connectionstring')

const connString = 'Data Source=tcp:localhost,1433;Initial Catalog=mssql_test;User Id=sa;Password=Upper_l0wercase;Encrypt=true;';

describe('node-mssql-repro', () => {
    let connection;
    before('connect', async () => {
        connection = await mssql.connect({
            ...resolve(connString),
        })
    });
    after('disconnect', async () => {
        await connection.close();
    });
    it('breaks as expected :-)', async () => {
        const statement = `if object_id('"dbo"."T1"','U') is NULL create table "dbo"."T1" ("location" geometry);`
        await connection.query(statement);

        const ps = new mssql.PreparedStatement(connection);
        try {
            ps.input('P1',mssql.Geometry);
            await ps.prepare(`insert into "dbo"."T1" ("location") values (@P1)`);
            console.log(await ps.execute({
                P1: '0 1 2 3',
            }));
            await ps.unprepare();
        } catch (err) {
            await ps.unprepare();
            console.error(err);
            throw err;
        }
        finally {
            await ps.unprepare();
        }

    });
});
