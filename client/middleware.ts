import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
 

export async function middleware(request: NextRequest) {
    //   const token = localStorage.getItem('token');

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    // console.log("token from middleware is : " , token);
    // If the user is not logged in, redirect to the login page.

    if(!token ){
      console.log("control reached here. ")
        return NextResponse.redirect(new URL('/register', request.url))
    }

    return NextResponse.next();

}
 
export const config = {
  matcher: ["/onboarding/:path*", "/test/:path*" , "/dashboard/:path*"],
}