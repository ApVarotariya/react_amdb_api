import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { STREAM_URL_RENDER, STREAM_URL_VERCEL } from './README';

export default function SeriesStreamPlayer({ imdbId }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  const [keyToken, setKeyToken] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [selectedLang, setSelectedLang] = useState(0);
  const [langOptions, setLangOptions] = useState([]);
  const [masterUrl, setMasterUrl] = useState('');
  const [qualityOptions, setQualityOptions] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingStream, setLoadingStream] = useState(false);

  // Fetch media info
  useEffect(() => {
    if (!imdbId) return;
    setLoadingInfo(true);

    axios.get(`${STREAM_URL_VERCEL}/api/v1/mediaInfo?id=${imdbId}`)
      .then(({ data }) => {
        if (data.success) {
          setKeyToken(data.data.key);
          setSeasons(data.data.playlist);
          setSelectedSeason(0);
        } else {
          console.error('mediaInfo returned success=false', data);
        }
      })
      .catch(err => console.error('mediaInfo error:', err))
      .finally(() => setLoadingInfo(false));
  }, [imdbId]);

  // Update episodes when season changes
  useEffect(() => {
    if (!seasons.length) return;
    const seasonFolder = seasons[selectedSeason]?.folder || [];
    setEpisodes(seasonFolder);
    setSelectedEpisode(0);
  }, [seasons, selectedSeason]);

  // Update language options when episode changes
  useEffect(() => {
    if (!episodes.length) return;

    const episode = episodes[selectedEpisode];
    const availableLangs = (episode.folder || []).filter(
      (entry) => entry && typeof entry.file === 'string' && entry.file.trim() !== ''
    );

    if (availableLangs.length === 0) {
      console.warn('No valid language streams found for this episode');
    }

    setLangOptions(availableLangs);
    setSelectedLang(0);
  }, [episodes, selectedEpisode]);

  // Fetch stream when language changes
  useEffect(() => {
    if (!langOptions.length || !keyToken) return;

    const fileEntry = langOptions[selectedLang];
    if (!fileEntry?.file) {
      console.error('Invalid file entry for selected language');
      return;
    }

    const payload = { file: fileEntry.file, key: keyToken };
    setLoadingStream(true);

    axios.post(`${STREAM_URL_VERCEL}/api/v1/getStream`, payload)
      .then(({ data }) => {
        if (data.success) {
          setMasterUrl(data.data.link);
        } else {
          console.error('getStream failed', data);
        }
      })
      .catch(err => console.error('getStream error', err))
      .finally(() => setLoadingStream(false));
  }, [langOptions, selectedLang, keyToken]);

  // Parse qualities
  useEffect(() => {
    if (!masterUrl) return;

    axios.get(masterUrl)
      .then(res => {
        const variants = res.data
          .split('\n')
          .reduce((acc, line, i, arr) => {
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

              acc.push({ label, url: arr[i + 1] });
            }
            return acc;
          }, []);
        setQualityOptions(variants);
        setSelectedQuality(0);
      })
      .catch(err => console.error('Error parsing master playlist:', err));
  }, [masterUrl]);

  // Build Artplayer quality list
  const qualityList = useMemo(() =>
    qualityOptions.map((q, i) => ({
      type: 'm3u8',
      url: (() => {
        try {
          return new URL(q.url, masterUrl).href;
        } catch {
          return '';
        }
      })(),
      html: q.label,
      default: i === selectedQuality,
    })),
    [qualityOptions, masterUrl, selectedQuality]
  );

  // Initialize Artplayer
  useEffect(() => {
    if (!containerRef.current || !masterUrl) return;

    playerRef.current?.destroy();
    playerRef.current = new Artplayer({
      container: containerRef.current,
      url: qualityList[selectedQuality]?.url || masterUrl,
      type: 'm3u8',
      autoplay: false,
      setting: true,
      settings: [
        {
          html: 'Fit Mode',
          tooltip: 'contain',
          selector: [
            { html: 'Fit (Contain)', value: 'contain', default: true },
            { html: 'Crop (Cover)', value: 'cover' },
            { html: 'Stretch (Fill)', value: 'fill' },
          ],
          onSelect: function (item) {
            this.video.style.objectFit = item.value;
            return item.html;
          },
        },
        {
          tooltip: 'Audio Language',
          html: langOptions[selectedLang]?.title || 'Audio',
          selector: langOptions.map((lang, idx) => ({
            html: lang.title,
            value: idx,
            default: idx === selectedLang,
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
      ],
      quality: qualityList,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      subtitleOffset: true,
      customType: {
        m3u8: (video, url) => {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
        },
      },
      controls: [
        {
          name: 'Season',
          position: 'right',
          html: seasons[selectedSeason]?.title || `Season ${selectedSeason + 1}`,
          selector: seasons.map((s, i) => ({
            html: s.title,
            value: i,
            default: i === selectedSeason,
          })),
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color:"#fff0e5",
            padding: '5px',
            },
          onSelect: (item) => {
            setSelectedSeason(item.value);
            return item.html;
          },
        },
        {
          name: 'Episode',
          position: 'right',
          html: episodes[selectedEpisode]?.title || `E${selectedEpisode + 1}`,
          selector: episodes.map((e, i) => ({
            html: e.title,
            value: i,
            default: i === selectedEpisode,
          })),
          style: {
            fontSize: '14px',
            color:"#fff0e5",
            padding: '5px',
            },
          onSelect: (item) => {
            setSelectedEpisode(item.value);
            return item.html;
          },
        },
      ],
    });
  }, [
    containerRef,
    masterUrl,
    qualityList,
    selectedQuality,
    seasons,
    selectedSeason,
    episodes,
    selectedEpisode,
    langOptions,
    selectedLang
  ]);

  if (loadingInfo) return <div>Loading show info…</div>;

  return (
    <div className='stream_player_main' style={{ width: '100%', height: '500px', float: 'left',padding:"0 15px", }}>
      {loadingStream ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
          Loading episode…
        </div>
      ) : (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  );
}
