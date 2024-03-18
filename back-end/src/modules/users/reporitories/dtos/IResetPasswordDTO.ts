interface IResetPasswordDTO {
  token: string
  password: string
  old_password: string
}

export { IResetPasswordDTO }