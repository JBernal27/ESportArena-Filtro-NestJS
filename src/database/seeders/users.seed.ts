import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Asegúrate de que la ruta sea correcta
import * as bcrypt from 'bcrypt';
import { roles } from '../../common/enums/roles.enum'; // Asegúrate de que la ruta sea correcta

export default class CreateUsers implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const usersData: Partial<User>[] = [
      {
        id: 1,
        name: 'Admin User',
        password: bcrypt.hashSync('admin123', 10),
        email: 'admin@correo.com',
        role: roles.ADMIN,
      },
      {
        id: 2,
        name: 'Player One',
        password: bcrypt.hashSync('player123', 10),
        email: 'player1@correo.com',
        role: roles.PLAYER,
      },
      {
        id: 3,
        name: 'Player Two',
        password: bcrypt.hashSync('player123', 10),
        email: 'player2@correo.com',
        role: roles.PLAYER,
      },
      {
        id: 4,
        name: 'Player Three',
        password: bcrypt.hashSync('player123', 10),
        email: 'player3@correo.com',
        role: roles.PLAYER,
      },
      {
        id: 5,
        name: 'Player Four',
        password: bcrypt.hashSync('player123', 10),
        email: 'player4@correo.com',
        role: roles.PLAYER,
      },
    ];

    for (const user of usersData) {
      const userExists = await userRepository.findOneBy({
        id: user.id,
      });

      if (!userExists) {
        console.log('Añadiendo usuario:', user.name);
        const newUser = userRepository.create(user);
        await userRepository.save(newUser);
      }
    }

    console.log('Usuarios creados');
  }
}
