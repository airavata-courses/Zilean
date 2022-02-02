# Audit Service 

## Database Setup 

Install Postgres 11.6 

- psql postgres
- create database audit_service_test;
- create user audit_service_test with encrypted password 'audit_service_test';
- grant all privileges on database audit_service_test to audit_service_test;


## Developer Purpose Notes

- Create migration 
    -  sequelize migration:generate --name [migraton-name]

### Service port 

5001

### API Documentation

https://documenter.getpostman.com/view/4946631/UVeCRTx3


