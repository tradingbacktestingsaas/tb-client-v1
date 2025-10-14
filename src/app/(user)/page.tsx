import { redirect } from 'next/navigation'
const RedirectRoute = () => {
    return redirect("/auth/signin")
}
export default RedirectRoute
