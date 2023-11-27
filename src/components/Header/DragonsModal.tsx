import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { global } from '../../common/global'
import "./modal.css"
import { buyDragon } from '../../store/user/actions'
import { useWeb3Context } from '../../hooks/web3Context'
import { getProfile } from '../../common/api'
import DragonInfoModal from './DragonInfoModal'

interface Props {
    dragonModalOpen: any
    setDragonModalOpen: any
}

const DragonModal = ({
    dragonModalOpen,
    setDragonModalOpen,
}: Props) => {
    const dispatch = useDispatch<any>()
    const { address } = useWeb3Context();
    useEffect(() => {
        if (global.dragons.length === 1) {
            setBuyedCommonDragon(false);
            setBuyedRareDragon(false);
            setBuyedLegenDragon(false);
        }
        if (global.dragons.length === 2) {
            setBuyedCommonDragon(true);
            setBuyedRareDragon(false);
            setBuyedLegenDragon(false);
        }
        if (global.dragons.length === 3) {
            setBuyedCommonDragon(true);
            setBuyedRareDragon(true);
            setBuyedLegenDragon(false);
        }
        if (global.dragons.length === 4) {
            setBuyedCommonDragon(true);
            setBuyedRareDragon(true);
            setBuyedLegenDragon(true);
        }
    }, [dragonModalOpen])

    const [buyedCommonDragon, setBuyedCommonDragon] = useState(false);
    const [buyedRareDragon, setBuyedRareDragon] = useState(false);
    const [buyedLegenDragon, setBuyedLegenDragon] = useState(false);

    const [dragonInfoModalOpen, setDragonInfoModalOpen] = useState(false);

    const onBuyCommonDragon = () => {
        dispatch(
            buyDragon(address, { dragonName: "common", dragonNo: 0 }, (res: any) => {
                if (res.data.name === "common") {
                    setBuyedCommonDragon(true);
                    getProfile(address, "dragon")
                }
            }),
            
        )
    }
    const onBuyRareDragon = () => {
        dispatch(
            buyDragon(address, { dragonName: "rare", dragonNo: 1 }, (res: any) => {
                if (res.data.name === "rare") {
                    setBuyedRareDragon(true);
                    getProfile(address, "dragon")
                }
            })
        )
    }
    const onBuyLegendDragon = () => {
        dispatch(
            buyDragon(address, { dragonName: "legendery", dragonNo: 2 }, (res: any) => {
                if (res.data.name === "legendery") {
                    setBuyedLegenDragon(true);
                    getProfile(address, "dragon")
                }
            })
        )
    }
      const selectDragon = () => {
        setDragonInfoModalOpen(true)
        
      }
    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
            xs: 130,
            md: 700,
        },
    }

    return (
        <>
            <Modal
                open={dragonModalOpen}
                // open={true}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <img alt="" src="/images/support/support_md_bg.png" />

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
                        onClick={() => setDragonModalOpen(false)}
                    />
                    <Box
                        className='displayCenter'
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            padding: "20px"
                        }}
                    >
                        <div
                            style={{
                                width: '200px', height: '200px',
                                margin: '0 5px',
                                backgroundImage: `url('/assets/images/dragons/common_dragon.png')`,
                                backgroundSize: 'cover',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                          onClick={() => buyedCommonDragon === false ? null : selectDragon()}
                        >
                            <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                                {
                                    buyedCommonDragon === false ?
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            common-70% <br />
                                            rare-20% <br />
                                            legendery-18%
                                        </div>
                                        :
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                color: 'white',
                                                textShadow: "2px 2px 5px wheat",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            COMMON
                                        </div>
                                }
                            </div>
                            {
                                buyedCommonDragon === false ?
                                    <Button
                                        onClick={() => onBuyCommonDragon()}
                                        sx={{
                                            width: '180px',
                                            height: '60px',
                                            marginTop: "20px",
                                            position: 'relative',
                                            top: '50px',
                                        }}
                                    >
                                        <img alt="" src="/assets/images/big-button.png" />
                                        <p
                                            style={{
                                                position: 'absolute',
                                                fontFamily: 'CubicPixel',
                                                fontSize: '28px',
                                                textAlign: 'center',
                                                color: '#e7e1e1',
                                                letterSpacing: "2px"
                                            }}
                                        >
                                            BUY
                                        </p>
                                    </Button>
                                    :
                                    <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>1</span></div>
                            }
                        </div>
                        <div
                            style={{
                                width: '200px', height: '200px',
                                margin: '0 5px',
                                backgroundImage: `url('/assets/images/dragons/rare_dragon.png')`,
                                backgroundSize: 'cover',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                          onClick={() => buyedRareDragon === false ? null : selectDragon()}
                        >
                            <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                                {
                                    buyedRareDragon === false ?
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            common-50% <br />
                                            rare-30% <br />
                                            legendery-20%
                                        </div>
                                        :
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                color: 'white',
                                                textShadow: "2px 2px 5px wheat",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            RARE
                                        </div>
                                }
                            </div>
                            {
                                buyedRareDragon === false ?
                                    buyedCommonDragon === false ?
                                        <Button
                                            sx={{
                                                width: '180px',
                                                height: '60px',
                                                marginTop: "20px",
                                                position: 'relative',
                                                top: '50px',
                                            }}
                                            disabled
                                        >
                                            <img alt="" src="/assets/images/big-button.png" style={{ opacity: '0.8' }} />
                                            <p
                                                style={{
                                                    position: 'absolute',
                                                    fontFamily: 'CubicPixel',
                                                    fontSize: '28px',
                                                    textAlign: 'center',
                                                    color: '#e7e1e1',
                                                    letterSpacing: "2px",
                                                    opacity: '0.8'
                                                }}
                                            >
                                                BUY
                                            </p>
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => onBuyRareDragon()}
                                            sx={{
                                                width: '180px',
                                                height: '60px',
                                                marginTop: "20px",
                                                position: 'relative',
                                                top: '50px',
                                            }}
                                        >
                                            <img alt="" src="/assets/images/big-button.png" />
                                            <p
                                                style={{
                                                    position: 'absolute',
                                                    fontFamily: 'CubicPixel',
                                                    fontSize: '28px',
                                                    textAlign: 'center',
                                                    color: '#e7e1e1',
                                                    letterSpacing: "2px"
                                                }}
                                            >
                                                BUY
                                            </p>
                                        </Button>
                                    :
                                    <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>1</span></div>
                            }
                        </div>
                        <div
                            style={{
                                width: '200px', height: '200px',
                                margin: '0 5px',
                                backgroundImage: `url('/assets/images/dragons/legency_dragon.png')`,
                                backgroundSize: 'cover',
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}
                          onClick={() => buyedLegenDragon === false ? null : selectDragon()}
                        >
                            <div style={{ position: 'relative', top: '5px', textAlign: 'left' }}>
                                {
                                    buyedLegenDragon === false ?
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                letterSpacing: '0',
                                                fontSize: '17px',
                                                color: 'white',
                                                textShadow: "2px 2px black",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            common-20% <br />
                                            rare-50% <br />
                                            legendery-30%
                                        </div>
                                        :
                                        <div
                                            style={{
                                                fontFamily: 'CubicPixel',
                                                color: 'white',
                                                textShadow: "2px 2px 5px wheat",
                                                marginLeft: '5px'
                                            }}
                                        >
                                            LEGENDERY
                                        </div>
                                }
                            </div>
                            {
                                buyedLegenDragon === false ?
                                    buyedRareDragon === false ?
                                        <Button
                                            sx={{
                                                width: '180px',
                                                height: '60px',
                                                marginTop: "20px",
                                                position: 'relative',
                                                top: '50px',
                                            }}
                                            disabled
                                        >
                                            <img alt="" src="/assets/images/big-button.png" style={{ opacity: '0.8' }} />
                                            <p
                                                style={{
                                                    position: 'absolute',
                                                    fontFamily: 'CubicPixel',
                                                    fontSize: '28px',
                                                    textAlign: 'center',
                                                    color: '#e7e1e1',
                                                    letterSpacing: "2px",
                                                    opacity: '0.8'
                                                }}
                                            >
                                                BUY
                                            </p>
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => onBuyLegendDragon()}
                                            sx={{
                                                width: '180px',
                                                height: '60px',
                                                marginTop: "20px",
                                                position: 'relative',
                                                top: '50px',
                                            }}
                                        >
                                            <img alt="" src="/assets/images/big-button.png" />
                                            <p
                                                style={{
                                                    position: 'absolute',
                                                    fontFamily: 'CubicPixel',
                                                    fontSize: '28px',
                                                    textAlign: 'center',
                                                    color: '#e7e1e1',
                                                    letterSpacing: "2px"
                                                }}
                                            >
                                                BUY
                                            </p>
                                        </Button>
                                    :
                                    <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>1</span></div>
                            }
                        </div>
                    </Box>
                </Box>
            </Modal>
            <DragonInfoModal 
            dragonInfoModalOpen={dragonInfoModalOpen}
            setDragonInfoModalOpen={setDragonInfoModalOpen}
            />
        </>
    )
}

export default DragonModal
