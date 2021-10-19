import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewUserInput } from './inputs/new-user.input';
import { UserEntity } from './entities/user.entity';
import { AuthUser } from './dto/auth-user.dto';
import { User } from './models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UpdateUserInput } from './inputs/update-user.input';
import config from '../../jwt.json';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }

    async login(email: string, password: string): Promise<string | null> {
        var user = await this.userRepository.findOne({
            where: {
                email: email
            },
            relations: ["organizer"],
            select: ["id", "email", "password", "organizer"]
        });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return null;
        }

        const payload: any = {
            id: user.id,
            email: user.email
        }

        if (!!user.organizer) {
            payload.organizer = {
                id: user.organizer.id
            };
        }

        return jwt.sign(payload, config.secret, config.options);
    }

    async create(data: NewUserInput): Promise<number> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(data.password, salt);

        const id = (await this.userRepository.insert({
            ...data,
            password: hash,
        })).raw[0].id;

        return id;
    }

    async update(id: number, data: UpdateUserInput): Promise<User> {
        const userData: any = {
            id: id
        };

        if (!!data.name) {
            userData.name = data.name;
        }

        if (!!data.organizer) {
            userData.organizer = {};

            if (!!data.organizer.description) {
                userData.organizer.description = data.organizer.description;
            }
            if (!!data.organizer.location) {
                userData.organizer.location = data.organizer.location;
            }
        }

        if (!!data.password) {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(data.password, salt);

            userData.password = hash;
        }

        return await this.userRepository.save(userData);
    }

    async findOneByEmail(email: string): Promise<AuthUser> {
        return await this.userRepository.findOne({
            where: {
                email: email
            }
        });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}