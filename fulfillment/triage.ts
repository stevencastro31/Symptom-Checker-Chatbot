const userToSeverity = (inputs: any): number => {
	let triageLevels: number = 0;
	let impression_cardio: number = 0;
	let impression_respiratory: number = 0;

	for (const name in inputs) {
		const property = inputs[name];
		switch (name) {
			case 'presyncope':
				if (property.has == true) {
					switch (property.difficulty) {
						case 'easy':
							triageLevels += 2;
							impression_cardio += 1;
							break;
						case 'moderate':
							triageLevels += 4;
							impression_cardio += 1;
							break;
						case 'hard':
							triageLevels += 6;
							impression_cardio += 1;
							break;
					}

				}

				break;

			case 'hematuria':

				if (property.has == true)
					switch (property.visibility) {
						case 'clear':
							triageLevels += 3;
							break;
						case 'cloudy':
							triageLevels += 5;
							break;
						case 'murky':
							triageLevels += 7;
							break;
					}
				break;

			case 'cyanosis':
				if (property.has == true)
					switch (property.pain_adjectives) {
						case 'mild':
							triageLevels += 4;
							impression_cardio += 1;
							impression_respiratory += 4;
							break;
						case 'moderate':
							triageLevels += 6;
							impression_cardio += 1;
							impression_respiratory += 4;
							break;
						case 'severe':
							triageLevels += 8;
							impression_cardio += 1;
							impression_respiratory += 4;
							break;
					}
				break;

			case 'blurry vision':
				if (property.has == true)
					switch (property.frequency_explicit) {
						case 'occasional':
							triageLevels += 2;
							impression_cardio += 2;
							break;
						case 'frequent':
							triageLevels += 4;
							impression_cardio += 2;
							break;
						case 'constant':
							triageLevels += 6;
							impression_cardio += 2;
							break;
					}
				break;

			case 'bradycardia':
				if (property.has == true)
					if (parseInt(property.heartrate) >= 50) {
						triageLevels += 3;
						impression_cardio += 1;
					} else if (parseInt(property.heartrate) >= 40) {
						triageLevels += 5;
						impression_cardio += 1;
					} else if (parseInt(property.heartrate) < 40) {
						triageLevels += 7;
						impression_cardio += 1;
					}
				break;

			case 'chest pain':
				if (property.has == true)
					switch (property.pain_adjectives) {
						case 'dull' && 'ache':
							triageLevels += 4;
							impression_cardio += 7;
							impression_respiratory += 5;
							break;
						case 'persistent' && 'ache':
							triageLevels += 6;
							impression_cardio += 7;
							impression_respiratory += 5;
							break;
						case 'sharp' || 'stabbing':
							triageLevels += 8;
							impression_cardio += 7;
							impression_respiratory += 5;
							break;
					}
				break;

			case 'chest tightness':
				switch (property.physical_state) {
					case 'activity':
						triageLevels += 4;
						break;
					case 'rest':
						triageLevels += 7;
						break;
				}
				break;

			case 'chills':
				if (property.has == true)
					switch (property.duration_generic) {
						case 'days':
							triageLevels += 1;
							impression_respiratory += 3;
							break;
						case 'weeks':
							triageLevels += 3;
							impression_respiratory += 3;
							break;
						case 'months':
							triageLevels += 5;
							impression_respiratory += 3;
							break;
					}
				break;

			case 'confusion':
				if (property.has == true)
					switch (property.duration_generic) {
						case 'days':
							triageLevels += 3;
							impression_cardio += 1;
							impression_respiratory += 2;
							break;
						case 'weeks':
							triageLevels += 5;
							impression_cardio += 1;
							impression_respiratory += 2;
							break;
						case 'months':
							triageLevels += 7;
							impression_cardio += 1;
							impression_respiratory += 2;
							break;
					}
				break;

			case 'cough':
				if (property.has == true)
					switch (property.duration_generic) {
						case 'days':
							switch (property.moisture) {
								case 'wet':
									triageLevels += 4;
									impression_respiratory += 5;
									break;
								case 'dry':
									triageLevels += 2;
									impression_respiratory += 5;
									break;
							}
							break;
						case 'weeks':
							switch (property.moisture) {
								case 'wet':
									triageLevels += 5;
									impression_respiratory += 5;
									break;
								case 'dry':
									triageLevels += 3;
									impression_respiratory += 5;
									break;
							}
							break;
						case 'months':
							switch (property.moisture) {
								case 'wet':
									triageLevels += 6;
									impression_respiratory += 5;
									break;
								case 'dry':
									triageLevels += 4;
									impression_respiratory += 5;
									break;

							}
						default:
							return 0;
					}
				break;

			case 'dizziness':
				if (property.has == true)
					switch (property.duration_generic) {
						case 'days':
							switch (property.physical_state) {
								case 'activity':
									triageLevels += 2;
									impression_cardio += 6;
									break;
								case 'rest':
									triageLevels += 4;
									impression_cardio += 6;
									break;
							}
							break;
						case 'weeks':
							switch (property.physical_state) {
								case 'activity':
									triageLevels += 3;
									impression_cardio += 6;
									break;
								case 'rest':
									triageLevels += 5;
									impression_cardio += 6;
									break;
							}
							break;
						case 'months':
							switch (property.physical_state) {
								case 'activity':
									triageLevels += 4;
									impression_cardio += 6;
									break;
								case 'rest':
									triageLevels += 6;
									impression_cardio += 6;
									break;
							}
					}
				break;

			case 'hyperhidrosis':
				if (property.has == true)
					switch (property.moisture) {
						case 'wet':
							triageLevels += 3;
							impression_cardio += 2;
							impression_respiratory += 1;
							break;
						case 'damp':
							triageLevels += 5;
							impression_cardio += 2;
							impression_respiratory += 1;
							break;
						case 'drenched':
							triageLevels += 7;
							impression_cardio += 2;
							impression_respiratory += 1;
							break;
					}
				break;

			case 'syncope':
				if (property.has == true)
					if (parseInt(property.count) < 1) {
						switch (property.trigger_activity) {
							case 'activity':
								triageLevels += 5;
								impression_cardio += 4;
								break;
							case 'rest':
								triageLevels += 6;
								impression_cardio += 4;
								break;
						}
					} else if (parseInt(property.count) <= 2) {
						switch (property.trigger_activity) {
							case 'activity':
								triageLevels += 6;
								impression_cardio += 4;
								break;
							case 'rest':
								triageLevels += 8;
								impression_cardio += 4;
								break;
						}
					} else if (parseInt(property.count) > 2) {
						switch (property.trigger_activity) {
							case 'activity':
								triageLevels += 8;
								impression_cardio += 4;
								break;
							case 'rest':
								triageLevels += 10;
								impression_cardio += 4;
								break;
						}
					}
				break;

			case 'asthenia':
				if (property.has == true)
					switch (property.trigger_activity) {
						case 'activity':
							triageLevels += 2;
							impression_cardio += 7;
							impression_respiratory += 6;
							break;
						case 'rest':
							triageLevels += 6;
							impression_cardio += 7;
							impression_respiratory += 6;
							break;
					}
				break;

			case 'fever':
				if (property.has == true)
					if (parseInt(property.temperature_body) >= 37.5 && parseInt(property.temperature_body) <= 38) {
						triageLevels += 3;
						impression_respiratory += 2;
					} else if (parseInt(property.temperature_body) >= 38.1 && parseInt(property.temperature_body) <= 39) {
						triageLevels += 5;
						impression_respiratory += 2;
					} else if (parseInt(property.temperature_body) > 39) {
						triageLevels += 7;
						impression_respiratory += 2;
					}
				break;

			case 'headaches':
				if (property.has == true)
					switch (property.pain_adjectives) {
						case 'dull' && 'ache':
							triageLevels += 4;
							break;
						case 'persistent' && 'ache':
							triageLevels += 6;
							break;
						case 'debilitating':
							triageLevels += 8;
							break;
					}
				break;

			case 'dysphagia':
				if (property.has == true)
					switch (property.difficulty) {
						case 'easy':
							triageLevels += 3;
							impression_cardio += 1;
							impression_respiratory += 2;
							break;
						case 'moderate':
							triageLevels += 5;
							impression_cardio += 1;
							impression_respiratory += 2;
							break;
						case 'hard':
							triageLevels += 7;
							impression_cardio += 1;
							impression_respiratory += 2;
					}
				break;

			case 'indigestion':
				if (property.has == true)
					switch (property.pain_adjectives) {
						case 'mild':
							triageLevels += 2;
							impression_cardio += 1;
							break;
						case 'moderate':
							triageLevels += 4;
							impression_cardio += 1;
							break;
						case 'severe':
							triageLevels += 6;
							impression_cardio += 1;
							break;
					}
				break;

			case 'loss of appetite':
				if (property.has == true)
					switch (property.pain_adjectives) {
						case 'mild':
							triageLevels += 2;
							impression_respiratory += 2;
							break;
						case 'moderate':
							triageLevels += 4;
							impression_respiratory += 2;
							break;
						case 'severe':
							triageLevels += 6;
							impression_respiratory += 2;
							break;
					}
				break;

			case 'loss of smell':
				if (property.has == true)
					switch (property.pain_adjectives) {
						case 'mild':
							triageLevels += 3;
							impression_respiratory += 1;
							break;
						case 'moderate':
							triageLevels += 5;
							impression_respiratory += 1;
							break;
						case 'severe':
							triageLevels += 7;
							impression_respiratory += 1;
							break;
					}
				break;

			case 'loss of taste':
				if (property.has == true)
					switch (property.pain_adjectives) {
						case 'mild':
							triageLevels += 3;
							impression_respiratory += 1;
							break;
						case 'moderate':
							triageLevels += 5;
							impression_respiratory += 1;
							break;
						case 'severe':
							triageLevels += 7;
							impression_respiratory += 1;
							break;
					}
				break;

			case 'low urine output':
				if (property.has == true)
					switch (property.difficulty) {
						case 'easy':
							triageLevels += 3;
							impression_cardio += 1;
							break;
						case 'moderate':
							triageLevels += 5;
							impression_cardio += 1;
							break;
						case 'hard':
							triageLevels += 8;
							impression_cardio += 1;
							break;
					}
				break;

			case 'mucus/sputum':
				if (property.has == true)
					switch (property.color_phlegm) {
						case 'clear':
						case 'white':
						case 'yellow':
						case 'green':
							switch (property.pain_adjectives) {
								case 'mild':
									triageLevels += 2;
									impression_respiratory += 5;
									break;
								case 'moderate':
									triageLevels += 4;
									impression_respiratory += 5;
									break;
								case 'severe':
									triageLevels += 6;
									impression_respiratory += 5;
									break;
							}
							break;
						case 'red':
							switch (property.pain_adjectives) {
								case 'mild':
									triageLevels += 5;
									impression_respiratory += 5;
									break;
								case 'moderate':
									triageLevels += 7;
									impression_respiratory += 5;
									break;
								case 'severe':
									triageLevels += 9;
									impression_respiratory += 5;
									break;
							}
							break;
					}
				break;

			case 'night sweats':
				if (property.has == true)
					switch (property.frequency_generic) {
						case 'occasional':
							triageLevels += 2;
							break;
						case 'frequent':
							triageLevels += 4;
							break;
						default:
							triageLevels += 6; // For severe
					}
				break;

			case 'nosebleed':
				if (property.has == true)
					switch (property.frequency_adverbs) {
						case 'occasional':
							triageLevels += 3;
							impression_cardio += 1;
							break;
						case 'frequent':
							triageLevels += 5;
							impression_cardio += 1;
							break;
						default:
							triageLevels += 8;
							impression_cardio += 1;// For severe
					}
				break;

			case 'pale complexion':
				if (property.has == true)
					switch (property.change_quantity) {
						case 'slightly':
							triageLevels += 2;
							impression_cardio += 1;
							break;
						case 'noticeably':
							triageLevels += 4;
							impression_cardio += 1;
							break;
						default:
							triageLevels += 6;
							impression_cardio += 1;// For severe
					}
				break;

			case 'palpitations':
				if (property.has == true)
					switch (property.frequency_adverbs) {
						case 'occasional':
							triageLevels += 3;
							impression_cardio += 3;
							break;
						case 'frequent':
							triageLevels += 5;
							impression_cardio += 3;
							break;
						default:
							triageLevels += 7;
							impression_cardio += 3; // For severe
					}
				break;

			case 'panic & anxiety':
				if (property.has == true)
					switch (property.frequency_adverbs) {
						case 'occasional':
							triageLevels += 3;
							impression_cardio += 3;
							impression_respiratory += 1;
							break;
						case 'frequent':
							triageLevels += 5;
							impression_cardio += 3;
							impression_respiratory += 1;
							break;
						default:
							triageLevels += 7;
							impression_cardio += 3;
							impression_respiratory += 1; // For severe
					}
				break;

			case 'peripheral edema':
				if (property.has == true)
					switch (property.change_quantity) {
						case 'slight':
							triageLevels += 3;
							impression_respiratory += 2;
							impression_cardio += 1;
							break;
						case 'persistent':
							triageLevels += 5;
							impression_respiratory += 2;
							impression_cardio += 1;
							break;
						default:
							triageLevels += 7;
							impression_respiratory += 2;
							impression_cardio += 1; // For severe
					}
				break;

			case 'rapid breathing':
				if (property.has == true)
					switch (property.frequency_adverbs) {
						case 'slightly':
							triageLevels += 3;
							impression_respiratory += 2;
							impression_cardio += 1;
							break;
						case 'noticeably':
							triageLevels += 5;
							impression_respiratory += 2;
							impression_cardio += 1;
							break;
						default:
							triageLevels += 8;
							impression_respiratory += 2;
							impression_cardio += 1;// For severe
					}
				break;

			case 'runny nose':
				if (property.has == true)
					switch (property.change_quantity) {
						case 'clear':
							triageLevels += 2;
							impression_respiratory += 1;
							impression_cardio += 3;
							break;
						case 'colored':
							triageLevels += 4;
							impression_respiratory += 1;
							impression_cardio += 3;
							break;
						default:
							triageLevels += 6;
							impression_respiratory += 1;
							impression_cardio += 3;// For severe
					}
				break;

			case 'short breath':
				if (property.has == true)
					switch (property.frequency_adverbs) {
						case 'only with exertion':
							triageLevels += 4;
							impression_respiratory += 5;
							impression_cardio += 2;
							break;
						case 'occurs with minimal activity':
							triageLevels += 6;
							impression_respiratory += 5;
							impression_cardio += 2;
							break;
						default:
							triageLevels += 8;
							impression_respiratory += 5;
							impression_cardio += 2; // For severe
					}
				break;

			case 'sore throat':
				if (property.has == true)
					switch (property.pain_intensity) {
						case '2':
							triageLevels += 2;
							impression_respiratory += 1;
							impression_cardio += 2;
							break;
						case '4':
							triageLevels += 4;
							impression_respiratory += 1;
							impression_cardio += 2;
							break;
						default:
							triageLevels += 6;
							impression_respiratory += 1;
							impression_cardio += 2;// For severe
					}
				break;

			case 'tachycardia':
				if (property.has == true)
					if (parseInt(property.heartrate) > 100) {
						if (property.heartrate <= 110) {
							triageLevels += 3;
							impression_respiratory += 2;
							impression_cardio += 1;
						} else if (property.heartrate <= 130) {
							triageLevels += 5;
							impression_respiratory += 2;
							impression_cardio += 1;
						} else {
							triageLevels += 8;
							impression_respiratory += 2;
							impression_cardio += 1; // For very high rates
						}
					}
				break;

			case 'trouble sleeping':
				if (property.has == true)
					switch (property.frequency_adverbs) {
						case 'occasional':
							triageLevels += 3;
							break;
						case 'frequent':
							triageLevels += 5;
							break;
						default:
							triageLevels += 7; // For severe
					}
				break;

			case 'weight gain':
				if (property.has == true)
					switch (property.change_quantity) {
						case 'small increase':
							triageLevels += 2;
							impression_cardio += 1;
							break;
						case 'noticeable increase':
							triageLevels += 4;
							impression_cardio += 1;
							break;
						default:
							triageLevels += 6;
							impression_cardio += 1; // For rapid and significant increase
					}
				break;

			case 'weight loss':
				if (property.has == true)
					switch (property.change_quantity) {
						case 'small decrease':
							triageLevels += 2;
							impression_respiratory += 3;
							break;
						case 'noticeable decrease':
							triageLevels += 4;
							impression_respiratory += 3;
							break;
						default:
							triageLevels += 6;
							impression_respiratory += 3; // For rapid and significant decrease
					}
				break;

			case 'wheezing':
				if (property.has == true)
					switch (property.frequency_adverbs) {
						case 'occasional':
							triageLevels += 3;
							impression_respiratory += 3;
							break;
						case 'frequent':
							triageLevels += 5;
							impression_respiratory += 3;
							break;
						default:
							triageLevels += 7;
							impression_respiratory += 3;// For constant
					}
				break;

			default:
				triageLevels += 0; // Default value for unknown symptoms
		}
	}

	return triageLevels;
}


export { userToSeverity }