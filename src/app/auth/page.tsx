import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
import Logo from "@/components/common/logo";

export default function AuthPage() {
  return (
    <div className="absolute flex items-center justify-center h-screen w-screen">
      <h1 className="absolute flex items-center top-4 left-4 text-2xl font-bold">
        <Logo className="w-8 h-8 mr-2" />
        BuildIT
      </h1>
      <div className="absolute flex items-center top-4 right-4 text-2xl font-bold">
        <ThemeTogglerButton modes={["light", "dark"]} />
      </div>
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="signin">
          <TabsList>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContents>
            <TabsContent value="signin" className="flex flex-col gap-6">
              <SignIn />
            </TabsContent>
            <TabsContent value="signup" className="flex flex-col gap-6">
              <SignUp />
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    </div>
  );
}
