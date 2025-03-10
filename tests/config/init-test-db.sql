DO
$$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_user') THEN
            CREATE USER test_user WITH PASSWORD 'test_password';
        END IF;
    END
$$;

CREATE DATABASE test_db;

GRANT ALL PRIVILEGES ON DATABASE test_db TO test_user;
