import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { STREAM_URL_RENDER } from './README'; // your API base URL

export default function StreamPlayer({ imdbId }) {
  const [playlist, setPlaylist] = useState([]);
  const [keyToken, setKeyToken] = useState('');
  const [selectedLang, setSelectedLang] = useState(0);
  const [masterUrl, setMasterUrl] = useState('');
  const [qualityOptions, setQualityOptions] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(0);

  // 1️⃣ Fetch playlist + key
  useEffect(() => {
    if (!imdbId) return;
    axios
      .get(`${STREAM_URL_RENDER}/api/v1/mediaInfo?id=${imdbId}`)
      .then(({ data }) => {
        if (data.success) {
          setPlaylist(data.data.playlist);
          console.log("data",imdbId);
          setKeyToken(data.data.key);
          setSelectedLang(0);
        }
      })
      .catch(console.error);
  }, [imdbId]);

  // 2️⃣ Exchange token+key → HLS master playlist URL
  useEffect(() => {
    if (!playlist.length || !keyToken) return;
    const { file } = playlist[selectedLang];
    axios
      .post(`${STREAM_URL_RENDER}/api/v1/getStream`, { file, key: keyToken })
      .then(({ data }) => {
        if (data.success) {
          setMasterUrl(data.data.link);
        }
      })
      .catch(console.error);
  }, [selectedLang, playlist, keyToken]);

  // 3️⃣ Parse the master playlist for quality variants
  useEffect(() => {
    if (!masterUrl) return;
    axios
      .get(masterUrl)
      .then(res => {
        const lines = res.data.split('\n');
        const variants = [];
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('#EXT-X-STREAM-INF')) {
            const info = lines[i];
            const url = lines[i + 1];
            const match = info.match(/RESOLUTION=(\d+x\d+)/);
            variants.push({
              label: match ? match[1] : 'Auto',
              url
            });
          }
        }
        setQualityOptions(variants);
        setSelectedQuality(0);
      })
      .catch(console.error);
  }, [masterUrl]);

  // Determine which URL to feed ReactPlayer
  const playUrl = qualityOptions.length
  ? new URL(qualityOptions[selectedQuality].url, masterUrl).href
  : masterUrl;
    // console.log("playUrl",playUrl);

  return (
    <div style={{ maxWidth: "100%", margin: 'auto', minHeight:"400px" }}>
      {/* Language Selector */}
      <div className='d-flex' style={{maxWidth:"400px",width:"100%",}}>
        {playlist.length > 0 && (
        <select
          value={selectedLang}
          className='form-control'
          onChange={e => {
            setSelectedLang(Number(e.target.value));
            setQualityOptions([]);           // reset qualities
            setMasterUrl('');
          }}
          style={{ margin: '8px', padding: '4px' }}
        >
          {playlist.map((item, idx) => (
            <option key={item.id} value={idx}>
              {item.title}
            </option>
          ))}
        </select>
      )}

      {/* Quality Selector */}
      {qualityOptions.length > 0 && (
        <select
          value={selectedQuality}
          className='form-control'
          onChange={e => setSelectedQuality(Number(e.target.value))}
          style={{ margin: '8px', padding: '4px' }}
        >
          {qualityOptions.map((q, idx) => (
            <option key={q.url} value={idx}>
              {q.label}
            </option>
          ))}
        </select>
      )}
      </div>
      

      {/* React Player */}
      {playUrl ? (
        <ReactPlayer
          url={playUrl}
          controls
          width="100%"
          height="100%"
        />
      ) : (
        <p>Loading video…</p>
      )}
    </div>
  );
}
