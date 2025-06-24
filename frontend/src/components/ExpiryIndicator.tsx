import {useMemo} from 'react'

interface ExpiryIndicatorProps {
    expiredDate?: Date
    className?: string
}

export function ExpiryIndicator({expiredDate, className=''}:ExpiryIndicatorProps){
    const indicatorColor = useMemo (()=>{
        if(!expiredDate){
            return 'bg-gray-400'
        }

        const now = new Date()
        const expiryDate = new Date(expiredDate)
        const timeDif = Math.ceil((expiryDate.getTime() - now.getTime())/(3600*24*1000))

        if(timeDif <= 1){
            return 'bg-red-500'
        }else if(timeDif <=3){
            return 'bg-yellow-500'
        }else {
            return 'bg-blue-500'
        }
    },[expiredDate])
    return (
        <div className={`w-2 h-2 rounded-full ${indicatorColor} ${className}`} />
    )
}