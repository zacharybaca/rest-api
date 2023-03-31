const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "firstName"',
          },
          notEmpty: {
            msg: 'Please provide a value for "firstName"',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "lastName"',
          },
          notEmpty: {
            msg: 'Please provide a value for "lastName"',
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "The email you entered already exists",
        },
        validate: {
          notNull: {
            msg: 'Please provide a value for "emailAddress"',
          },
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "password"',
          },
          notEmpty: {
            msg: 'Please provide a value for "password"',
          },
          len: {
            args: [10, 20],
            msg: 'Please provide a value for "password" that is between 10 and 20 characters in length',
          },
        },
      },
      confirmedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          if (val === this.password) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue("confirmedPassword", hashedPassword);
          }
        },
        validate: {
          notNull: {
            msg: "Both passwords must match",
          },
        },
      },
    },
    { sequelize }
  );

  User.associate = (models) => {
    User.hasMany(models.Course);
  };

  return User;
};
