import axios from "axios"

export async function getTopArtists(username) {
  try {
    const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

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
    return res.data.topartists.artist.map((entry) => {
      return {
        name: entry.name,
        playCount: entry.playcount
      }
    });
  } catch (err) {
    console.error("Error getting LastFM info: ", err)
    return null;
  }
}

async function getSpotifyAccessToken() {
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
    console.error("Error getting Spotify access token: ", error)
  }
}

export async function getSpotifyArtistInfo(artistName) {
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
        console.error("Error getting Spotify access token: ", error)
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

    // get stuff we care about
    const firstResult = res.data.artists.items[0];

    if (!firstResult) {
      return null;
    }

    const spotifyData = {
      id: firstResult.id,
      image: firstResult.images[1].url,
      genres: firstResult.genres,
      popularity: parseInt(firstResult.popularity),
      followers: parseInt(firstResult.followers.total)
    }

    return spotifyData;
  } catch (error) {
    console.error("Error searching Spotify: ", error)
    return null;
  }
}

export async function getSpotifyArtistInfoById(id) {
  try {
    if (!id) {
      throw new Error("No ID given!")
    }

    // get api access token
    const accessToken = await getSpotifyAccessToken()

    // abort if fail 
    if (!accessToken) {
      throw new Error()
    }

    // NOTE: baseUrl has id in it
    const baseUrl = `https://api.spotify.com/v1/artists/${id}`

    // send auth
    const headers = {
      "Authorization": `Bearer ${accessToken}`
    }

    const res = await axios.get(baseUrl, {
      headers: headers,
    })

    const resData = res.data;

    const wantedData = {
      id: resData.id,
      name: resData.name,
      image: resData.images[0].url,
      genres: resData.genres,
      followers: parseInt(resData.followers.total),
      popularity: parseInt(resData.popularity),
    }

    return wantedData;
  } catch (error) {
    console.error(error)
    return null;
  }
}
