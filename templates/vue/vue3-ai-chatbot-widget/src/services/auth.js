import { Clerk } from '@clerk/clerk-js'
import { createApp, defineAsyncComponent } from 'vue'

export class AuthService {
    constructor(args) {
        this.authMode = ['clerk', 'basic', 'none'].includes(args.authMode) ? args.authMode : 'none'
        this.copilotBackend = args.copilotBackend
        this.clerkPublicKey = args.clerkPublicKey
    }

    async signIn(password = null) {
        if (this.authMode === 'clerk') {
            return this.clerkSignIn()
        }

        if (this.authMode === 'basic') {
            if (sessionStorage.getItem('copilot_auth_token')) {
                return { authenticated: true, token: sessionStorage.getItem('copilot_auth_token') }
            }

            if (password) {
                return this.basicSignIn(password)
            }
            return this.basicSignIn()
        }

        return {}
    }

    async clerkSignIn() {
        
        const clerk = new Clerk(this.clerkPublicKey)
        await clerk.load()
        
        if (!clerk.user) {
          clerk.openSignIn({
            appearance: {
              socialButtonsVariant: "iconButton",
              elements: {
                card: {
                  boxShadow: 'none',
                },
                modalCloseButton: {
                  display: 'none'
                },
                footerAction: {
                  display: 'none'
                },
              }
            },
          })
        
          await new Promise(resolve => {
            clerk.addListener(({ user }) => {
              if (user) resolve()
            })
          })
        }
        return clerk.user
    }

    async fetchBasicAuth(password) {
        if (!password) {
            throw new Error('Password required')
        }

        const response = await fetch(`${this.copilotBackend}/auth`, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${password}`
            },
            body: JSON.stringify({
                messages: [{
                    "role": "user",
                    "content": "Authenticate"
                }]
            })
        })
        const token = await response.text()

        if (response.status !== 200 || !token) {
            throw new Error('Authentication failed')
        }
        sessionStorage.setItem('copilot_auth_token', token)
        return { authenticated: true, token: token}
    }

    async basicSignIn() {
        sessionStorage.removeItem('copilot_auth_token')
        return new Promise((resolve, reject) => {
            const modalContainer = document.createElement('div')
            document.body.appendChild(modalContainer)

            const BasicAuthWindow = defineAsyncComponent(() =>
                import('../components/BasicAuthWindow.vue')
            )

            const authApp = createApp(BasicAuthWindow, {
                'onSubmit': async (password) => {
                    try {
                        const user = await this.fetchBasicAuth(password)
                        authApp.unmount()
                        document.body.removeChild(modalContainer)
                        resolve(user)
                    } catch (error) {
                        throw error
                    }
                }
            })

            authApp.mount(modalContainer)
        })
    }
}