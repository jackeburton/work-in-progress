function LoginGoogle() {
    const googleLogin = () => {
        window.open('http://localhost:3000/api/google', '_self')
    }

    return (
        <div>
            <h2>Login with Google</h2>
            <button onClick={googleLogin}>Login with Google</button>
        </div>
    )
}

export default LoginGoogle
