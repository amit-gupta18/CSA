import React from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Navbar() {
    return (
        <div>
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">CSA</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                            How it Works
                        </Link>
                        <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                            Testimonials
                        </Link>
                    </nav>
                    <Button asChild>
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>
            </header>
        </div>
    )
}

export default Navbar