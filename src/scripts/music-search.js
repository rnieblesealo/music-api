import axios from "axios"

export async function getTopArtists(username) {
  try {
    const apiKey = import.meta.env.VITE_LASTFM_API_KEY;
    console.log("Key: ", apiKey)

    const params = new URLSearchParams({
      api_key: apiKey,
      method: "user.gettopartists",
      user: username,
      period: "7day",
      limit: "12",
      format: "json"
    })

    const baseUrl = "https://ws.audioscrobbler.com/2.0/"

    // call lastfm for username
    const res = await axios.get(baseUrl, {
      params: params
    })

    // return top artists json
    return res.data.topartists.artist;
  } catch (err) {
    console.error("Error getting LastFM info: ", err)
    return null;
  }
}

export async function getArtistImage(artistName) {
  try {
    async function getAccessToken() {
      // NOTE: spotify uses form-encoded data which is why it's weird to call its api
      try {
        // make auth string (base64)
        const clientID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        const auth = btoa(`${clientID}:${clientSecret}`) // encode as base64 (used by legacy apis as auth)

        const baseUrl = "https://accounts.spotify.com/api/token"

        // url encoded data
        const data = new URLSearchParams({
          grant_type: "client_credentials"
        })

        // auth headers
        const headers = {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }

        // get access token from response!
        const res = await axios.post(baseUrl, data, {
          headers: headers
        })

        return res.data.access_token
      } catch (error) {
        console.log("Error getting Spotify access token: ", error)
      }
    }

    // get api access token
    const accessToken = await getAccessToken()

    // abort if fail 
    if (!accessToken) {
      throw new Error()
    }

    const baseUrl = "https://api.spotify.com/v1/search"

    // send auth to search api
    const headers = {
      "Authorization": `Bearer ${accessToken}`
    }

    // send query
    const params = new URLSearchParams({
      q: `artist:${artistName}`,
      type: "artist"

    })

    // get response image url
    const res = await axios.get(baseUrl, {
      headers: headers,
      params: params
    })

    // return first image result (which is likely to be the actual one we're looking for) 
    return res.data.artists.items[0]
  } catch (error) {
    console.log("Error searching Spotify: ", error)
    return null;
  }
}
