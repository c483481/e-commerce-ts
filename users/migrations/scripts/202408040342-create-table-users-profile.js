"use strict";

const { CommonColumn } = require("../columns");
const { id, version, createdAt, updatedAt, xid, modifiedBy } = CommonColumn;
const name = "users-profile";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(name, {
            id,
            xid,
            modifiedBy,
            version,
            createdAt,
            updatedAt,
            userAuthId: {
                type: Sequelize.BIGINT,
                unique: true,
                allowNull: true,
                references: {
                    model: "users-auth",
                    key: "id",
                },
            },
            firstName: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            dateOfBirth: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable(name);
    },
};
