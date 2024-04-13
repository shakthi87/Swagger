exports.timecalculateTimeAgo=function calculateTimeAgo(created_at){
      const now =new Date();
      const timeDiff=now.getTime()-new Date(created_at).getTime();
      const secondsDiff=Math.round(timeDiff/1000);
      const minutesdiff=Math.round(timeDiff/(1000*60));
      const hoursDiff=Math.round(timeDiff/(1000*60*60));
      const daysDiff=Math.round(timeDiff/(1000*60*60*24));
      const monthsDiff=Math.round(timeDiff/(1000*60*60*24*30));
      const yearsDiff=Math.round(timeDiff/(1000*60*60*24*30*365));
      let formattedTime='';
      if(yearsDiff>1){
          return formattedTime=`${yearsDiff} years ago`
      }
      else if(monthsDiff){
          return formattedTime=`${monthsDiff} month ago`

      }
      else if(daysDiff){
          return formattedTime=`${daysDiff} days ago`
      }
      else if(hoursDiff){
          return formattedTime=`${hoursDiff} hours ago`
      }
      else if(minutesdiff){
          return formattedTime=`${minutesdiff} minutes ago`
      }
      else {
          return formattedTime=`${secondsDiff} just now`
      }
      
  }