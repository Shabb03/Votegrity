data "external_schema" "sequelize" {
    program = [
        "npx",
        "@ariga/atlas-provider-sequelize",
        "load",
        "--path", "./models,
        "--dialect", "mysql",
    ]
}

env "sequelize" {
    src = data.external_schema.sequelize.url
    dev = "docker://mysql/8/dev"
    migration {
        dir = "file://migrations"
    }
    format {
        migrate {
            diff = "{{ sql . \"  \" }}"
        }
    }
}