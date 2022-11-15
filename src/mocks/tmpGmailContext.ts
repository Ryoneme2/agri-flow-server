import moment from 'moment'

export const forgetPass = (link: string, mail: string) => {
  return `<img src="https://fphftuccochbjgwngnrc.supabase.co/storage/v1/object/public/image-bucket/logo/logo.png" width="300px" height="150"><h3>Reset Password</h3><p><br></p><p>password reset event has been triggered. The password reset window is limited to two hours.</p><p><br></p><p>If you do not reset your password within two hours, you will need to submit a new request.</p><p><br></p><p>To complete the password reset process, visit the following link:</p><p><br></p><p><a href="${link}" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">${link}</a></p><p><br></p><p>Username <a href="mailto:${mail}" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">${mail}</a></p><p>${moment().format("LLL")}</p>`
}