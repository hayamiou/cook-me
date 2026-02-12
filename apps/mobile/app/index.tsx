import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/text'

export default function TabOneScreen() {
  const router = useRouter()
  return (
    <View className="flex-1 justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex-row">
          <View className="flex-1 gap-1.5">
            <CardTitle>Inscription (+18)</CardTitle>
            <CardDescription>Enter your details</CardDescription>
          </View>
        </CardHeader>

        <CardContent>
          <View className="w-full justify-center gap-4">
            <View className="gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" />
            </View>
            <View className="gap-2">
              <Label htmlFor="name">password</Label>
              <Input id="name" placeholder="banana123" />
            </View>
          </View>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button className="w-full" onPress={() => router.push('accueil')}>
            <Text>Login</Text>
          </Button>
          <Button variant="outline" className="w-full">
            <Text>Later</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  )
}
