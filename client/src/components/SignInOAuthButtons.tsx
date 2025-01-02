import { useSignIn } from "@clerk/clerk-react"
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
  
    const { signIn, isLoaded } = useSignIn();

    if (!isLoaded) {
        return null;
    }
    
    const signInWithGoogle = () => {
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback"
        })
    }

    return (
    <Button onClick={signInWithGoogle} variant = {"secondary"} className = "w-full test-white h-11">
        Sign in with google
    </Button>
  )
}

export default SignInOAuthButtons
