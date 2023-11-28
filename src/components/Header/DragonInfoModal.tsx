import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { global } from '../../common/global'
import "./modal.css"
import React, { useState, useEffect } from "react"
import SelectMeatModal from './selectMeatModal'
import { styled } from '@mui/material/styles';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { Button } from '@mui/material'

interface Props {
    setDragonModalOpen: any
    dragonInfoModalOpen: any
    setDragonInfoModalOpen: any
    dragonInfo: any
    setDragonInfo: any
    meat: any
    setMeat: any
}

const DragonInfoModal = ({
    setDragonModalOpen,
    dragonInfoModalOpen,
    setDragonInfoModalOpen,
    dragonInfo,
    setDragonInfo,
    meat,
    setMeat,
}: Props) => {
    
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 20,
        outline: '3px solid black',
        borderRadius: 8,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));
    const [meatModalOpen, setMeatModalOpen] = useState(false);

    const onExit = () => {
        setDragonModalOpen(true);
        setDragonInfoModalOpen(false)
    }
    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '550px',
        height: '600px',
        background: "url(/assets/images/set2.png)",
        backgroundSize: '100% 100%',
        bgcolor: 'transparent',
        boxShadow: 24,
        p: 4,
        pt: 1,
    }

    return (
        <>
            <Modal
                open={dragonInfoModalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <img
                        alt=""
                        src="/images/support/support_md_close_btn.png"
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '7%',
                            transform: 'translate(26%, -27%)',
                            cursor: 'pointer',
                            zIndex: 5,
                        }}
                        onClick={() => onExit()}
                    />
                    <Box className='displayCenter'
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            padding: "20px",
                            flexDirection: "column"
                        }}
                    >
                        <div
                            className='levelTitle'
                            style={{ position: 'unset', fontSize: '23px', margin: '5px' }}
                        >
                            LEVEL: <span style={{ color: '#ff8a00' }}>{dragonInfo.level}</span>
                        </div>
                        <div style={{ width: '230px', margin: '5px' }}>
                            <BorderLinearProgress variant="determinate" value={dragonInfo.rarity} style={{background: 'none'}} />
                            <p
                                style={{
                                    color: 'white',
                                    fontSize: '20px',
                                    fontFamily: 'CubicPixel',
                                    fontWeight: 'bold',
                                    letterSpacing: '2px',
                                    textShadow: '0 0 3px black, 0 0 3px black',
                                    position: 'absolute',
                                    top: '94px',
                                    left: '260px'
                                }}
                            >
                                {dragonInfo.rarity}%
                            </p>
                            <Button
                                style={{
                                    height: '26px', width: "20px",
                                    borderLeft: '3px solid black',
                                    position: 'absolute',
                                    top: '94px',
                                    right: '128px'
                                }}
                                onClick={() => meat === 0 ? alert("Not Enough Meat") : setMeatModalOpen(true)}
                            >
                                <img alt="" src={`assets/images/plus.png`} width={'25px'} style={{marginLeft: '-33px', marginTop: '3px'}}/>
                            </Button>
                        </div>
                        <img alt="" src={`assets/images/dragons/${dragonInfo.dragonName}_dragon_avatar.png`} width={'250px'} />
                        <div
                            style={{
                                width: '150px', height: '90px',
                                backgroundImage: `url('/assets/images/dam_bg.png')`,
                                backgroundSize: 'cover',
                                marginRight: '90px'
                            }}
                        >
                            <p
                                style={{
                                    color: 'white',
                                    fontFamily: 'CubicPixel',
                                    fontSize: '22px',
                                    position: 'absolute',
                                    bottom: '152px',
                                    right: '266px'
                                }}
                            >
                                {/* {dragonInfo.damage} */}
                                NONE
                            </p>
                        </div>
                        <div
                            style={{
                                width: '150px', height: '90px',
                                backgroundImage: `url('/assets/images/health_bg.png')`,
                                backgroundSize: 'cover',
                                marginRight: '83px'
                            }}
                        >
                            <p
                                style={{
                                    color: 'white',
                                    fontFamily: 'CubicPixel',
                                    fontSize: '22px',
                                    position: 'absolute',
                                    bottom: '66px',
                                    right: '266px'
                                }}
                            >
                                {/* {dragonInfo.hp} */}
                                NONE
                            </p>
                        </div>
                    </Box>
                </Box>
            </Modal>
            <SelectMeatModal
                meatModalOpen={meatModalOpen}
                setMeatModalOpen={setMeatModalOpen}
                dragonInfo={dragonInfo}
                setDragonInfo={setDragonInfo}
                meat={meat}
                setMeat={setMeat}
            />
        </>
    )
}

export default DragonInfoModal
