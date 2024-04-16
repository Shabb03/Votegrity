data "external_schema" "sequelize" {
    program = [
        "npx",
        "@ariga/atlas-provider-sequelize",
        "load",
        "--path", "./models",
        "--dialect", "mysql", // mariadb | postgres | sqlite | mssql
    ]
}

env "sequelize" {
    src = data.external_schema.sequelize.url
    dev = "mysql://root:Tommy2045%40@localhost:3306/votegrity"
    migration {
        dir = "file://migrations"
    }
    format {
        migrate {
            diff = "{{ sql . \"  \" }}"
        }
    }
}