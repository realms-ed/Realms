var auth_url = "https://zoom.us/oauth/authorize?response_type=code&client_id=JomeAb3LScWahNG6mYWh3A&redirect_uri=https://realms-ed.herokuapp.com"

export function loginFunc() {
    window.location.href = auth_url
}