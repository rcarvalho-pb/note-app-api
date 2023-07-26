import { AppError } from "../utils/AppError.js";
import sqliteConnection from "../database/sqlite/index.js";
import bcrypt from "bcryptjs";

export class UsersController { 
  async create(request, response) {
    const { name, email, password } = request.body;

    if(!name) {
      throw new AppError("Nome é obrigatório.");
    }

    const database = await sqliteConnection();
    const checkExistUser = await database.get("select * from users where email = (?)", [email]);

    if(checkExistUser) throw new AppError("Email já está em uso.");

    const hashedPassword = await bcrypt.hash(password, 8);

    await database.run("insert into users (name, email, password) values (?, ?, ?)", [name, email, hashedPassword]);

    response.status(201).json({ name, email, hashedPassword });
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const db = await sqliteConnection();
    const user = await db.get("select * from users where id = (?)", [id]);

    console.log(id, user);
    
    if(!user) throw new AppError("Usuário inexistente.")

    const userWithUpdatedEmail = await db.get("select * from users where email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) throw new AppError("Esta email já está em uso.");

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if ( password && !old_password) throw new AppError("É necessário informar a senha antiga para mudar para uma nova.")

    if(password && old_password) {
      const checkOldPassword = await bcrypt.compare(old_password, user.password)

      if(!checkOldPassword) throw new AppError("Senha antigo não confere.")

      user.password = await hash(password, 8);
    }

    await db.run("update users set name = ?, email = ?, updated_at = DATETIME('now'), password = ? where id = ?", [user.name, user.email, user.password, id]);

    response.status(200).json(user);
  }
}