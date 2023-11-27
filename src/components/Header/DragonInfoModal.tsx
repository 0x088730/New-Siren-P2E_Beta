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
    dragonInfoModalOpen: any
    setDragonInfoModalOpen: any
}

const DragonInfoModal = ({
    dragonInfoModalOpen,
    setDragonInfoModalOpen,
}: Props) => {
    const dispatch = useDispatch<any>()
    const { address } = useWeb3Context();
        
    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
            xs: 130,
            md: 500,
        },
    }

    return (
        <>
            <Modal
                open={dragonInfoModalOpen}
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
                        onClick={() => setDragonInfoModalOpen(false)}
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
                        
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default DragonInfoModal
