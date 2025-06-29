import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { STREAM_URL_RENDER } from './README';

export default function MovieStreamPlayer({ imdbId }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);
  const [keyToken, setKeyToken] = useState('');
  const [selectedLang, setSelectedLang] = useState(0);
  const [masterUrl, setMasterUrl] = useState('');
  const [qualityOptions, setQualityOptions] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imdbId) return;
    setLoading(true);
    axios.get(`${STREAM_URL_RENDER}/api/v1/mediaInfo?id=${imdbId}`)
      .then((mediaRes) => {
        if (mediaRes.data.success) {
          setPlaylist(mediaRes.data.data.playlist);
          setKeyToken(mediaRes.data.data.key);
          setSelectedLang(0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [imdbId]);

  useEffect(() => {
    if (!playlist.length || !keyToken) return;
    axios.post(`${STREAM_URL_RENDER}/api/v1/getStream`, { file: playlist[selectedLang].file, key: keyToken })
      .then(({ data }) => data.success && setMasterUrl(data.data.link))
      .catch(console.error);
  }, [playlist, keyToken, selectedLang]);

  useEffect(() => {
    if (!masterUrl) return;
    axios.get(masterUrl)
      .then(res => {
       const variants = res.data.split('\n').reduce((acc, line, i, arr) => {
        if (line.startsWith('#EXT-X-STREAM-INF')) {
          const match = line.match(/RESOLUTION=\d+x(\d+)/);
          const height = match ? parseInt(match[1], 10) : null;

          let label = 'Auto';
          if (height) {
            if (height <= 240) label = '240P';
            else if (height <= 360) label = '360P';
            else if (height <= 480) label = '480P';
            else if (height <= 720) label = '720P';
            else if (height <= 1080) label = '1080P';
            else label = `${height}P`;
          }

          acc.push({ text: label, url: arr[i + 1] });
        }
        return acc;
      }, []);
        setQualityOptions(variants);
        setSelectedQuality(0);
      })
      .catch(console.error);
  }, [masterUrl]);

  const qualityList = useMemo(() => qualityOptions.map((q, idx) => ({
    type: 'm3u8', url: new URL(q.url, masterUrl).href,
    html: q.text, default: idx === selectedQuality
  })), [qualityOptions, masterUrl, selectedQuality]);

  useEffect(() => {
    if (!containerRef.current || !masterUrl) return;
    playerRef.current?.destroy();
    const ap = new Artplayer({
      container: containerRef.current,
      url: qualityList[selectedQuality]?.url || masterUrl,
      type: 'm3u8',
      setting: false,
      autoplay: false,
      speed: [0.5, 1, 1.5, 2],
      quality: qualityList,
      lang: 'en',
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      subtitleOffset: true,
      // subtitle: {
      //           type: "vtt",
      //           escape: false,
      //           style: {
      //             color: "#fff",
      //             // @ts-ignore
      //             "font-size": "35px",
      //             "font-family": "sans-serif",
      //             "text-shadow":
      //               "-3px 3px 4px rgba(0, 0, 0, 1),2px 2px 4px rgba(0, 0, 0, 1),1px -1px 3px rgba(0, 0, 0, 1),-3px -2px 4px rgba(0, 0, 0, 1)",
      //           },
      //         },
      lock: true,
      fastForward: true,
      pip: true,
      mutex: true,
      customType: {
        m3u8: (video, url) => {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
        }
      },
      controls: [
        {
          name: 'Lang',
          position: 'right',
          index: 10,
          html: playlist[selectedLang]?.title || 'Lang',
          selector: playlist.map((item, idx) => ({
            default: idx === selectedLang,
            html: item.title,
            value: idx,
          })),
           style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color:"#fff0e5",
            padding: '5px',
            },
          onSelect: (item) => {
            setSelectedLang(item.value);
            return item.html;
          },
        },
      ]
    });
    playerRef.current = ap;
  }, [containerRef, masterUrl, qualityList, selectedQuality, playlist, selectedLang]);

  return (
    <div className='stream_player_main' style={{ position: 'relative', width: '100%', height: '500px',float:"left",padding:"0 15px" }}>
      {loading
        ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Loading…</div>
        : <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      }
    </div>
  );
}
