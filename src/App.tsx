import LogIn  from "./login";
import handleSignIn from "./handleSignIn"
import handleSignUp from "./handleSignUp";


function App() {
  let email:string;
  let password:string;

  return <LogIn emailP={(item: string) => {email = item}} passwordP={(item: string) => {password = item}} signUp={(item: boolean) => {if(item) {handleSignUp(email, password)}}} signIn={(item: boolean) => {if(item) {handleSignIn(email, password)}}}/>
}


export default App
