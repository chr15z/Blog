export class AuthRequest {
  constructor(
    public email: string,
    public password: string
  ) {}
}

export class UserDetail {
  constructor(
    public userId: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public dateOfBirth: Date,
    public phoneNumber: string,
    public address: string,
    public admin: boolean,
    public points: number
  ) {}
}

export class UserSearch {
  constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public earliestDate: Date,
    public latestDate: Date,
    public phoneNumber: string,
    public address: string,
    public admin: boolean,
    public accountLocked: boolean
  ) {}
}

export class UserList {
  constructor(
    public userId: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public admin: boolean,
    public accountLocked: boolean
  ) {}
}

export class UserLock {
  constructor(
    public userId: string,
    public email: string,
    public accountLocked: boolean
  ) {}
}

export class UserPasswordReset {
  constructor(
    public email: string,
    public password: string,
    public token: string
  ) {}
}

export class UserPoints {
  constructor(
    public email: string,
    public firstName: string,
    public points: number
  ) {}
}
