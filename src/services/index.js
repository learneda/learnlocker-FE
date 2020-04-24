const baseURL = process.env.REACT_APP_BASE_URL

const clientUrl = process.env.REACT_APP_CLIENT_URL

const authURL = `${baseURL}/auth`
const apiURL = `${baseURL}/api`
const postURL = `${baseURL}/api/post/?url=`
export { baseURL, authURL, apiURL, postURL, clientUrl }
