import musicModel from "../models/music.model.js"
import albumModel from "../models/album.model.js"
import {uploadFile} from "../services/storage.service.js"
import jwt from "jsonwebtoken"

async function createMusic(req, res) {

    const { title } = req.body
    const file = req.file

    const result = await uploadFile(file.buffer.toString("base64"))

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id,
    })

    res.status(201).json({
      message: "Music created successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    })
}

async function createAlbum(req, res) {
  

    const {title, musics} = req.body

    const album = await albumModel.create({
      title, 
      artist: req.user.id,
      musics: musics
    })

    res.status(201).json({
      message: "Album Created Successfully",
      album: {
        id: album._id,
        title: album.title,
        artist: album.artist,
        musics: album.musics
      }
    })
 
}

export default { createMusic, createAlbum }
