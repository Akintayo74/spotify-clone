import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useStateProvider} from '../utils/StateProvider'
import axios from 'axios'
import {reducerCases} from '../utils/Constants'

export default function CurrentTrack() {
    const[{ token, currentlyPlaying }, dispatch] = useStateProvider();
    useEffect(()=> {
        const getCurrentTrack = async () => {
            const response = await axios.get(
              'https://api.spotify.com/v1/me/player/currently-playing',
              {
                headers: {
                  Authorization: "Bearer "+token, 
                  "Content-Type": "application/json",
                },
              }
            );
            if(response.data !==""){
                const {item} = response.data
                const currentlyPlaying = {
                    id: item.id,
                    name: item.name,
                    artists: item.artists.map((artist=> artist.name)),
                    image: item.album.images[2].url,

                }
                dispatch({type:reducerCases.SET_PLAYING, currentlyPlaying})
            }
           
        };
        getCurrentTrack();
    }, [token,dispatch])
    return (
        <Container>
            {
                currentlyPlaying && (
                    <div className="track">
                        <div className="track__image">
                            <img src={currentlyPlaying.image} alt='Currently playing' className="current-image"/>
                        </div>

                        <div className="track__info">
                            <h4>{currentlyPlaying.name}</h4>
                            <h6>{currentlyPlaying.artists.join(", ")}</h6>
                        </div>
                    </div>
                )
            }
        </Container>
    )
}


const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.3rem;
      min-width: 0;
    }
    
    h4, h6 {
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    h4 {
      color: white;
    }
    
    h6 {
      color: #b3b3b3;
    }
  }
  
  .track__image {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
      object-fit: cover;
      display: block;
    }
  }

  @media (max-width: 800px) {
    width: auto;
    
    .track {
      width: auto;
    }
  }
`;