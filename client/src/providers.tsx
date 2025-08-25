import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { authClient } from "@/lib/auth-client"
import { useNavigate, NavLink } from "react-router-dom"
import { AnchorHTMLAttributes, forwardRef } from "react"

interface AuthUILinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

const AuthUILink = forwardRef<HTMLAnchorElement, AuthUILinkProps>(
  ({ href, children, ...rest }, ref) => (
    <NavLink to={href} ref={ref} {...rest}>
      {children}
    </NavLink>
  ),
)

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
      <AuthUIProvider
        authClient={authClient}
        navigate={navigate}
        Link={AuthUILink}
      >
          {children}
      </AuthUIProvider>
    )
}
