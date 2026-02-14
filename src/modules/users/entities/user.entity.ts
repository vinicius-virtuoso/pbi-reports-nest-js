type UserRole = 'ADMIN' | 'USER';

type UserCreate = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

export type UserView = {
  id: string | null;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
  lastAccess?: Date | null;
};

export class User {
  private constructor(
    readonly id: string | null,
    readonly email: string,
    readonly name: string,
    readonly password: string,
    readonly role: UserRole,
    readonly isActive: boolean,
    readonly createdAt?: Date,
    readonly updatedAt?: Date | null,
    readonly lastAccess?: Date | null,
  ) {}

  /* ---------- FACTORIES ---------- */

  static create(data: UserCreate): User {
    return new User(
      null,
      data.email,
      data.name,
      data.password,
      data.role,
      true,
    );
  }

  static fromPersistence(data: {
    id: string;
    email: string;
    name: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    lastAccess: Date | null;
  }): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.password,
      data.role,
      data.isActive,
      data.createdAt,
      data.updatedAt,
      data.lastAccess,
    );
  }

  updateProfile(data: { name?: string; password?: string }): User {
    return new User(
      this.id,
      this.email,
      data.name ?? this.name,
      data.password ?? this.password,
      this.role,
      this.isActive,
      this.createdAt,
      new Date(),
      this.lastAccess,
    );
  }

  updateByAdmin(data: {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    isActive?: boolean;
  }): User {
    return new User(
      this.id,
      data.email ?? this.email,
      data.name ?? this.name,
      data.password ?? this.password,
      data.role ?? this.role,
      data.isActive ?? this.isActive,
      this.createdAt,
      new Date(),
      this.lastAccess,
    );
  }

  deactivate(): User {
    return new User(
      this.id,
      this.email,
      this.name,
      this.password,
      this.role,
      false,
      this.createdAt,
      new Date(),
      this.lastAccess,
    );
  }

  activate(): User {
    return new User(
      this.id,
      this.email,
      this.name,
      this.password,
      this.role,
      true,
      this.createdAt,
      new Date(),
      this.lastAccess,
    );
  }

  updateLastAccess(date: Date = new Date()): User {
    return new User(
      this.id,
      this.email,
      this.name,
      this.password,
      this.role,
      this.isActive,
      this.createdAt,
      this.updatedAt,
      date,
    );
  }

  toView(): UserView {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastAccess: this.lastAccess,
    };
  }
}
