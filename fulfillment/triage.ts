const userToSeverity = (input:  {name: string;property: {[key: string]: any;}}): number => {
    const { name, property } = input;
    const { moisture, duration_generic, color_phlegm,triggered_activity,visibility } = property;

    
    switch (name) {
        case 'presyncope':
          switch (property.duration_explicit) {
            case 'days':
              return 2;
            case 'weeks':
              return 4;
            case 'months':
              return 6;
          }
          break;
    
        case 'hematuria':
          switch (property.duration_explicit) {
            case 'days':
              return 3;
            case 'weeks':
              return 5;
            case 'months':
              return 7;
          }
          break;
    
        case 'cyanosis':
          switch (property.duration_explicit) {
            case 'days':
              return 4;
            case 'weeks':
              return 6;
            case 'months':
              return 8;
          }
          break;
    
        case 'blurry vision':
          switch (property.duration_explicit) {
            case 'days':
              return 2;
            case 'weeks':
              return 4;
            case 'months':
              return 6;
          }
          break;
    
        case 'bradycardia':
          if (parseInt(property.heartrate) >=50 ) {
            return 3;
          } else if (parseInt(property.heartrate) >= 40) {
            return 5;
          } else if (parseInt(property.heartrate) < 40){
            return 7;
          }
          break;
    
        case 'chest pain':
          switch (property.pain_adjectives) {
            case 'dull'&&'ache':
              return 4;
            case 'persistent' && 'ache':
              return 6;
            case 'sharp' || 'stabbing':
              return 8;
          }
          break;
    
        case 'chest tightness':
          switch (property.physical_state) {
            case 'activity':
              return 4;
              case 'rest':
                return 7;
          }
          break;
    
        case 'chills':
          switch (property.duration_explicit) {
            case 'days':
              return 1;
            case 'weeks':
              return 3;
            case 'months':
              return 5;
          }
          break;
    
        case 'confusion':
          switch (property.duration_explicit) {
            case 'days':
              return 3;
            case 'weeks':
              return 5;
            case 'months':
              return 7;
          }
          break;
    
        case 'cough':
            switch (property.duration_generic) {
                case 'days':
                    switch(property.moisture){
                      case 'wet':
                        return 4;
                      case 'dry':
                        return 2;
                    }
                case 'weeks':
                  switch(property.moisture){
                    case 'wet':
                      return 5;
                    case 'dry':
                      return 3;
                  }
                  case 'months':
                    switch(property.moisture){
                      case 'wet':
                        return 6;
                      case 'dry':
                        return 4;

                    }
                default:
                    return 0;
            }
          break;
    
        case 'dizziness':
          switch (property.duration_explicit) {
            case 'days':
              switch(property.physical_state){
                case 'activity':
                  return 2;
                  case 'rest':
                  return 4;
              }
            case 'weeks':
              switch(property.physical_state){
                case 'activity':
                  return 3;
                  case 'rest':
                  return 5;
              }
            case 'months':
              switch(property.physical_state){
                case 'activity':
                  return 4;
                  case 'rest':
                  return 6;
              }
          }
          break;
    
        case 'hyperhidrosis':
          switch (property.duration_explicit) {
            case 'days':
              return 3;
            case 'weeks':
              return 5;
            case 'months':
              return 7;
          }
          break;
    
        case 'syncope':
          if (parseInt(property.count) < 1 ) {
            switch(property.trigger_activity){
              case 'activity':
                return 5;
              case 'rest':
                return 6;
            }
          } else if (parseInt(property.count) <= 2) {
            switch(property.trigger_activity){
              case 'activity':
                return 6;
              case 'rest':
                return 8;
            }
          } else if (parseInt(property.count) > 2){
            switch(property.trigger_activity){
              case 'activity':
                return 8;
              case 'rest':
                return 10;
            }
          }
          break;
    
        case 'asthenia':
          switch (property.trigger_activity) {
            case'activity':
              return 2;
            case 'rest':
              return 6;
          }
          break;
    
        case 'fever':
          if (parseInt(property.temperature_body) >=37.5 && parseInt(property.temperature_body)<= 38 ) {
            return 3;
          } else if (parseInt(property.temperature_body) >=38.1 && parseInt(property.temperature_body)<= 39) {
            return 5;
          } else if (parseInt(property.temperature_body) >39){
            return 7;
          }
          break;
    
        case 'headaches':
          switch (property.pain_adjectives) {
            case 'dull'&&'ache':
              return 4;
            case 'persistent' && 'ache':
              return 6;
            case 'debilitating':
              return 8;
          }
          break;
    
        case 'dysphagia':
          switch (property.difficulty) {
           case 'easy':
            return 3;
          case 'moderate':
            return 5;
         case 'hard':
            return 7;
          }
          break;
    
        case 'indigestion':
          switch (property.frequency_generic) {
            //TODO Indigestion
          }
          break;
    
        case 'loss of appetite':
          switch (property.duration_explicit) {
            case 'days':
              return 2;
            case 'weeks':
              return 4;
            case 'months':
              return 6;
          }
          break;

        case 'loss of smell':
            switch (property.pain_adjectives) {
                case 'mild':
                    return 3;
                case 'moderate':
                    return 5;
                case 'severe':
                    return 7;
            }
            break;

        case 'loss of taste':
            switch (property.pain_adjectives) {
                case 'mild':
                    return 3;
                case 'moderate':
                    return 5;
                case 'severe':
                    return 7;
            }
            break;

        case 'low urine output':
            switch (property.difficulty) {
                case 'easy':
                    return 3;
                case 'moderate':
                    return 5;
                case 'hard':
                    return 8;
            }
            break;

        case 'mucus/sputum':
            switch (property.color_phlegm) {
                case 'clear':
                case 'white':
                case 'yellow':
                case 'green':
                    switch (property.pain_adjectives) {
                        case 'mild':
                            return 2;
                        case 'moderate':
                            return 4;
                        case 'severe':
                            return 6;
                    }
                    break;
                case 'red':
                    switch (property.pain_adjectives) {
                        case 'mild':
                            return 5;
                        case 'moderate':
                            return 7;
                        case 'severe':
                            return 9;
                    }
                    break;
            }
            break;

        case 'night sweats':
          switch (property.frequency_generic) {
            case 'occasional':
              return 2;
            case 'frequent':
              return 4;
            default:
              return 6; // For severe
          }
          break;

        case 'nosebleed':
          switch (property.frequency_adverbs) {
            case 'occasional':
              return 3;
            case 'frequent':
              return 5;
            default:
              return 8; // For severe
          }
          break;

        case 'pale complexion':
          switch (property.change_quantity) {
            case 'slightly':
              return 2;
            case 'noticeably':
              return 4;
            default:
              return 6; // For severe
          }
          break;

        case 'palpitations':
          switch (property.frequency_adverbs) {
            case 'occasional':
              return 3;
            case 'frequent':
              return 5;
            default:
              return 7; // For severe
          }
          break;

        case 'panic & anxiety':
          switch (property.frequency_adverbs) {
            case 'occasional':
              return 3;
            case 'frequent':
              return 5;
            default:
              return 7; // For severe
          }
          break;

        case 'peripheral edema':
          switch (property.change_quantity) {
            case 'slight':
              return 3;
            case 'persistent':
              return 5;
            default:
              return 7; // For severe
          }
          break;

        case 'rapid breathing':
          switch (property.frequency_adverbs) {
            case 'slightly':
              return 3;
            case 'noticeably':
              return 5;
            default:
              return 8; // For severe
          }
          break;

        case 'runny nose':
          switch (property.change_quantity) {
            case 'clear':
              return 2;
            case 'colored':
              return 4;
            default:
              return 6; // For severe
          }
          break;

        case 'short breath':
          switch (property.frequency_adverbs) {
            case 'only with exertion':
              return 4;
            case 'occurs with minimal activity':
              return 6;
            default:
              return 8; // For severe
          }
          break;

        case 'sore throat':
          switch (property.pain_intensity) {
            case '2':
              return 2;
            case '4':
              return 4;
            default:
              return 6; // For severe
          }
          break;

        case 'tachycardia':
          if (parseInt(property.heartrate) > 100) {
            if (property.heartrate <= 110) {
              return 3;
            } else if (property.heartrate <= 130) {
              return 5;
            } else {
              return 8; // For very high rates
            }
          }
          break;

        case 'trouble sleeping':
          switch (property.frequency_adverbs) {
            case 'occasional':
              return 3;
            case 'frequent':
              return 5;
            default:
              return 7; // For severe
          }
          break;

        case 'weight gain':
          switch (property.change_quantity) {
            case 'small increase':
              return 2;
            case 'noticeable increase':
              return 4;
            default:
              return 6; // For rapid and significant increase
          }
          break;

        case 'weight loss':
          switch (property.change_quantity) {
            case 'small decrease':
              return 2;
            case 'noticeable decrease':
              return 4;
            default:
              return 6; // For rapid and significant decrease
          }
          break;

        case 'wheezing':
          switch (property.frequency_adverbs) {
            case 'occasional':
              return 3;
            case 'frequent':
              return 5;
            default:
              return 7; // For constant
          }
          break;
    
        default:
          return 0; // Default value for unknown symptoms
      }
      return 0;
      
}

export { userToSeverity }