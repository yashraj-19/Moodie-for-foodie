import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MessageSquare, Share2, Search, Filter, TrendingUp, Users, Clock } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"

export default function Community() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Community</h1>
            <p className="text-gray-600">Connect with fellow food enthusiasts and share your culinary creations</p>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search posts..." className="pl-10 w-full md:w-[250px]" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Share Your Creation</CardTitle>
                  <Button className="bg-amber-600 hover:bg-amber-700">Post</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=50&width=50" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input placeholder="What did you cook today?" className="mb-3" />
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          Add Photo
                        </Button>
                        <Button variant="outline" size="sm" className="text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          Tag Recipe
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="trending">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="following">
                  <Users className="h-4 w-4 mr-2" />
                  Following
                </TabsTrigger>
                <TabsTrigger value="recent">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="space-y-6">
                {[1, 2, 3, 4].map((post) => (
                  <CommunityPost
                    key={post}
                    id={post}
                    username={`foodie${post}`}
                    userImage={`/placeholder.svg?height=50&width=50`}
                    timeAgo={`${post * 2} hours ago`}
                    content={`Just made this amazing dish following a recipe I found on Culinary Canvas! The flavors are incredible and it was so easy to make. Definitely adding this to my regular rotation! #homecooking #delicious`}
                    image={`/placeholder.svg?height=400&width=600`}
                    likes={42 + post * 10}
                    comments={12 + post}
                    recipeTag={post % 2 === 0 ? "Homemade Pasta Carbonara" : undefined}
                  />
                ))}
              </TabsContent>

              <TabsContent value="following" className="space-y-6">
                {[1, 2].map((post) => (
                  <CommunityPost
                    key={post}
                    id={post + 10}
                    username={`chef${post}`}
                    userImage={`/placeholder.svg?height=50&width=50`}
                    timeAgo={`${post} day ago`}
                    content={`Sharing my latest creation! This seasonal dish uses fresh ingredients from my garden. Let me know if you'd like the recipe!`}
                    image={`/placeholder.svg?height=400&width=600`}
                    likes={85 + post * 15}
                    comments={24 + post * 3}
                    recipeTag="Garden Fresh Salad"
                  />
                ))}
              </TabsContent>

              <TabsContent value="recent" className="space-y-6">
                {[1, 2, 3].map((post) => (
                  <CommunityPost
                    key={post}
                    id={post + 20}
                    username={`newbie${post}`}
                    userImage={`/placeholder.svg?height=50&width=50`}
                    timeAgo={`${post * 10} minutes ago`}
                    content={`My first attempt at baking bread! Thanks to the detailed instructions and tips on this app, it turned out pretty good for a beginner!`}
                    image={`/placeholder.svg?height=400&width=600`}
                    likes={5 + post}
                    comments={2}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#homecooking",
                    "#vegetarian",
                    "#quickmeals",
                    "#baking",
                    "#healthyeating",
                    "#comfortfood",
                    "#desserts",
                    "#mealprep",
                  ].map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map((user) => (
                  <div key={user} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/placeholder.svg?height=50&width=50`} />
                        <AvatarFallback>U{user}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Chef User {user}</p>
                        <p className="text-xs text-gray-500">{100 - user * 10} recipes shared</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-amber-600">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full text-amber-600">
                  View All Contributors
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-2 border-amber-500 pl-3">
                  <p className="font-medium text-sm">Virtual Cooking Class</p>
                  <p className="text-xs text-gray-500">May 15, 2025 • 6:00 PM</p>
                  <p className="text-xs text-gray-600 mt-1">Learn to make authentic Italian pasta from scratch</p>
                </div>
                <div className="border-l-2 border-gray-200 pl-3">
                  <p className="font-medium text-sm">Community Cook-Off</p>
                  <p className="text-xs text-gray-500">May 28, 2025 • 2:00 PM</p>
                  <p className="text-xs text-gray-600 mt-1">Join our monthly cooking competition</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full text-amber-600">
                  View All Events
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

interface CommunityPostProps {
  id: number
  username: string
  userImage: string
  timeAgo: string
  content: string
  image: string
  likes: number
  comments: number
  recipeTag?: string
}

function CommunityPost({
  id,
  username,
  userImage,
  timeAgo,
  content,
  image,
  likes,
  comments,
  recipeTag,
}: CommunityPostProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={userImage} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">@{username}</p>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-gray-700 mb-4">{content}</p>
        {recipeTag && (
          <Link href={`/recipes/${id}`}>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {recipeTag}
            </Badge>
          </Link>
        )}
        <div className="rounded-lg overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={`Post by ${username}`} className="w-full h-auto object-cover" />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Heart className={`h-4 w-4 mr-1 ${id % 3 === 0 ? "fill-red-500 text-red-500" : ""}`} />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <MessageSquare className="h-4 w-4 mr-1" />
            {comments}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

