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

interface Props {
  dragonChooseModalOpen: any
  setDragonChooseModalOpen: any
  cardNum: any
  setDrg: any
  cardImg: any
  setCardImg: any
}

const DragonChooseModal = ({
  dragonChooseModalOpen,
  setDragonChooseModalOpen,
  cardNum,
  setDrg,
  cardImg,
  setCardImg,
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
  }, [dragonChooseModalOpen])

  const [buyedCommonDragon, setBuyedCommonDragon] = useState(false);
  const [buyedRareDragon, setBuyedRareDragon] = useState(false);
  const [buyedLegenDragon, setBuyedLegenDragon] = useState(false);

  const onBuyDragon = (name: any, num: any) => {
    dispatch(
      buyDragon(address, { dragonName: name, dragonNo: num }, (res: any) => {
        if (res.data.name === name) {
          if(name === "common") setBuyedCommonDragon(true);
          if(name === 'rare') setBuyedRareDragon(true);
          if(name === 'legendery') setBuyedLegenDragon(true);
          getProfile(address, "dragon")
          setDrg(res.data.drg);
        }
      }),
    )
  }

  const selectDragon = (order: any, url: any) => {
    if (cardNum === "1") setCardImg({ ...cardImg, first: { name: order, url } })
    if (cardNum === "2") setCardImg({ ...cardImg, second: { name: order, url } })
    if (cardNum === "3") setCardImg({ ...cardImg, third: { name: order, url } })
    setDragonChooseModalOpen(false);
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
        open={dragonChooseModalOpen}
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
            onClick={() => setDragonChooseModalOpen(false)}
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
              onClick={() => buyedCommonDragon === false ? null : selectDragon("1", `url('/assets/images/dragons/common_dragon.png')`)}
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
                    onClick={() => onBuyDragon("common", 0)}
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
                  <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[1] !== undefined ? global.dragons[1].level : "1"}`}</span></div>
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
              onClick={() => buyedRareDragon === false ? null : selectDragon("2", `url('/assets/images/dragons/rare_dragon.png')`)}
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
                      onClick={() => onBuyDragon("rare", 1)}
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
                  <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[2] !== undefined ? global.dragons[2].level : "1"}`}</span></div>
              }
            </div>
            <div
              style={{
                width: '200px', height: '200px',
                margin: '0 5px',
                backgroundImage: `url('/assets/images/dragons/legendery_dragon.png')`,
                backgroundSize: 'cover',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => buyedLegenDragon === false ? null : selectDragon("3", `url('/assets/images/dragons/legendery_dragon.png')`)}
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
                      onClick={() => onBuyDragon("legendery", 2)}
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
                  <div className='levelTitle'>LEVEL: <span style={{ color: '#ff8a00' }}>{`${global.dragons[3] !== undefined ? global.dragons[3].level : "1"}`}</span></div>
              }
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default DragonChooseModal
