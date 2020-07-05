Tween = {};
Tween.activeTweens = [];
Tween.idCounter = 0;
Tween.create = (obj, targetProperties, duration, easing, completedCallback) => {
	let singleTween = {};
	singleTween.id = ++Tween.idCounter;
	singleTween.obj = obj;
	singleTween.objStart = {};
	singleTween.objTarget = targetProperties;
	Tween.saveProperties(singleTween.objStart, obj, targetProperties);
	singleTween.startTime = new Date().getTime();
	singleTween.endTime = singleTween.startTime + duration;
	singleTween.easing = easing;
	singleTween.completedCallback = completedCallback;
	Tween.activeTweens.push(singleTween);
	return singleTween.id;
};
Tween.cancel = (tweenId) => {
	let tween = Tween.activeTweens.find(tween => tweenId == tween.id);
	let index = Tween.activeTweens.indexOf(tween);
	Tween.activeTweens.splice(index, 1);
	return tween;
};
Tween.stop = (tweenId) => {
	let tween = Tween.cancel(tweenId);
	tween.completedCallback();
	return tween;
};
Tween.saveProperties = (singleTweenStart, obj, targetProperties) => {
	for(let property in targetProperties) {
		let startValue = obj[property];
		if(typeof startValue == "object") {
			singleTweenStart[property] = {};
			Tween.saveProperties(singleTweenStart[property], obj[property], targetProperties[property]);
			continue;
		}
		singleTweenStart[property] = startValue;
	}
}
Tween.update = () => {
	let completed = [];
	for (let i = 0; i < Tween.activeTweens.length; i++) {
		let singleTween = Tween.activeTweens[i];
		if(Tween.updateSingleTween(singleTween) == 1) {
			completed.push(singleTween);
		}
	}

	for (let i = 0; i < completed.length; i++) {
		let singleTween = completed[i];
		singleTween.completedCallback();
		let foundIndex = Tween.activeTweens.indexOf(singleTween);
		if(foundIndex != -1) {
			Tween.activeTweens.splice(foundIndex, 1);
		}
	}
};
Tween.updateSingleTween = (singleTween) => {
	let currentTime = new Date().getTime();
	let runTime = currentTime - singleTween.startTime;
	let duration = singleTween.endTime - singleTween.startTime;
	let percentageComplete = Math.min(1, runTime / duration);
	let valueToUpdate = singleTween.easing(percentageComplete);
	Tween.updateProperties(singleTween.obj, singleTween.objStart, singleTween.objTarget, valueToUpdate);
	return percentageComplete;
}

Tween.updateProperties =(obj, objStart, objTarget, valueToUpdate) => {
	for(let property in objStart) {
		let startValue = objStart[property];
		if(typeof startValue == "object") {
			Tween.updateProperties(obj[property], objStart[property], objTarget[property], valueToUpdate);
			continue;
		}
		let endValue = objTarget[property];
		let delta = endValue - startValue;
		obj[property] = startValue + (delta * valueToUpdate);
	}
};

Tween.Easing = {};

Tween.Easing.Linear = {};
Tween.Easing.Linear.EaseNone = (percentageComplete) => percentageComplete;

Tween.Easing.Quadratic = {};
Tween.Easing.Quadratic.EaseIn = (percentageComplete) => percentageComplete * percentageComplete;
Tween.Easing.Quadratic.EaseOut = (percentageComplete) => -percentageComplete * ( percentageComplete - 2 );
Tween.Easing.Quadratic.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * percentageComplete * percentageComplete;
	return - 0.5 * ( --percentageComplete * ( percentageComplete - 2 ) - 1 );
};
Tween.Easing.Cubic = {};
Tween.Easing.Cubic.EaseIn = (percentageComplete) => percentageComplete * percentageComplete * percentageComplete;
Tween.Easing.Cubic.EaseOut = (percentageComplete) => --percentageComplete * percentageComplete * percentageComplete + 1;
Tween.Easing.Cubic.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * percentageComplete * percentageComplete * percentageComplete;
	return 0.5 * ( ( percentageComplete -= 2 ) * percentageComplete * percentageComplete + 2 );
};
Tween.Easing.Quartic = {};
Tween.Easing.Quartic.EaseIn = (percentageComplete) => percentageComplete * percentageComplete * percentageComplete * percentageComplete;
Tween.Easing.Quartic.EaseOut = (percentageComplete) => -( --percentageComplete * percentageComplete * percentageComplete * percentageComplete - 1 );
Tween.Easing.Quartic.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete *= 2 ) < 1) return 0.5 * percentageComplete * percentageComplete * percentageComplete * percentageComplete;
	return - 0.5 * ( ( percentageComplete -= 2 ) * percentageComplete * percentageComplete * percentageComplete - 2 );
};
Tween.Easing.Quintic = {};
Tween.Easing.Quintic.EaseIn = (percentageComplete) => percentageComplete * percentageComplete * percentageComplete * percentageComplete * percentageComplete;
Tween.Easing.Quintic.EaseOut = (percentageComplete) => ( percentageComplete = percentageComplete - 1 ) * percentageComplete * percentageComplete * percentageComplete * percentageComplete + 1;
Tween.Easing.Quintic.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * percentageComplete * percentageComplete * percentageComplete * percentageComplete * percentageComplete;
	return 0.5 * ( ( percentageComplete -= 2 ) * percentageComplete * percentageComplete * percentageComplete * percentageComplete + 2 );
};
Tween.Easing.Sinusoidal = {};
Tween.Easing.Sinusoidal.EaseIn = (percentageComplete) => -Math.cos( percentageComplete * Math.PI / 2 ) + 1;
Tween.Easing.Sinusoidal.EaseOut = (percentageComplete) => Math.sin( percentageComplete * Math.PI / 2 );
Tween.Easing.Sinusoidal.EaseInOut = (percentageComplete) => -0.5 * ( Math.cos( Math.PI * percentageComplete ) - 1 );
Tween.Easing.Exponential = {};
Tween.Easing.Exponential.EaseIn = (percentageComplete) => {
	return percentageComplete == 0 ? 0 : Math.pow( 2, 10 * ( percentageComplete - 1 ) );
};

Tween.Easing.Exponential.EaseOut = (percentageComplete) => {
	return percentageComplete == 1 ? 1 : - Math.pow( 2, - 10 * percentageComplete ) + 1;
};

Tween.Easing.Exponential.EaseInOut = (percentageComplete) => {
	if ( percentageComplete == 0 ) return 0;
	if ( percentageComplete == 1 ) return 1;
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( percentageComplete - 1 ) );
	return 0.5 * ( - Math.pow( 2, - 10 * ( percentageComplete - 1 ) ) + 2 );
};
Tween.Easing.Circular = {};
Tween.Easing.Circular.EaseIn = (percentageComplete) => -(Math.sqrt( 1 - percentageComplete * percentageComplete ) - 1);
Tween.Easing.Circular.EaseOut = (percentageComplete) => Math.sqrt( 1 - (--percentageComplete * percentageComplete) );
Tween.Easing.Circular.EaseInOut = (percentageComplete) => {
	if ( ( percentageComplete /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - percentageComplete * percentageComplete) - 1);
	return 0.5 * ( Math.sqrt( 1 - ( percentageComplete -= 2) * percentageComplete) + 1);
};
Tween.Easing.Elastic = {};
Tween.Easing.Elastic.EaseIn = (percentageComplete) => {
	var s, a = 0.1, p = 0.4;
	if ( percentageComplete == 0 ) return 0; if ( percentageComplete == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return - ( a * Math.pow( 2, 10 * ( percentageComplete -= 1 ) ) * Math.sin( ( percentageComplete - s ) * ( 2 * Math.PI ) / p ) );
};

Tween.Easing.Elastic.EaseOut = (percentageComplete) => {
	var s, a = 0.1, p = 0.4;
	if ( percentageComplete == 0 ) return 0; if ( percentageComplete == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return ( a * Math.pow( 2, - 10 * percentageComplete) * Math.sin( ( percentageComplete - s ) * ( 2 * Math.PI ) / p ) + 1 );
};

Tween.Easing.Elastic.EaseInOut = (percentageComplete) => {
	var s, a = 0.1, p = 0.4;
	if ( percentageComplete == 0 ) return 0; if ( percentageComplete == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	if ( ( percentageComplete *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( percentageComplete -= 1 ) ) * Math.sin( ( percentageComplete - s ) * ( 2 * Math.PI ) / p ) );
	return a * Math.pow( 2, -10 * ( percentageComplete -= 1 ) ) * Math.sin( ( percentageComplete - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
};
Tween.Easing.Back = {};
Tween.Easing.Back.EaseIn = (percentageComplete) => {
	var s = 1.70158;
	return percentageComplete * percentageComplete * ( ( s + 1 ) * percentageComplete - s );
};

Tween.Easing.Back.EaseOut = (percentageComplete) => {
	var s = 1.70158;
	return ( percentageComplete = percentageComplete - 1 ) * percentageComplete * ( ( s + 1 ) * percentageComplete + s ) + 1;
};

Tween.Easing.Back.EaseInOut = (percentageComplete) => {
	var s = 1.70158 * 1.525;
	if ( ( percentageComplete *= 2 ) < 1 ) return 0.5 * ( percentageComplete * percentageComplete * ( ( s + 1 ) * percentageComplete - s ) );
	return 0.5 * ( ( percentageComplete -= 2 ) * percentageComplete * ( ( s + 1 ) * percentageComplete + s ) + 2 );
};
Tween.Easing.Bounce = {};
Tween.Easing.Bounce.EaseIn = (percentageComplete) => 1 - Tween.Easing.Bounce.EaseOut( 1 - percentageComplete );
Tween.Easing.Bounce.EaseOut = (percentageComplete) => {
	if ( ( percentageComplete /= 1 ) < ( 1 / 2.75 ) ) {
		return 7.5625 * percentageComplete * percentageComplete;
	} else if ( percentageComplete < ( 2 / 2.75 ) ) {
		return 7.5625 * ( percentageComplete -= ( 1.5 / 2.75 ) ) * percentageComplete + 0.75;
	} else if ( percentageComplete < ( 2.5 / 2.75 ) ) {
		return 7.5625 * ( percentageComplete -= ( 2.25 / 2.75 ) ) * percentageComplete + 0.9375;
	} else {
		return 7.5625 * ( percentageComplete -= ( 2.625 / 2.75 ) ) * percentageComplete + 0.984375;
	}
};
Tween.Easing.Bounce.EaseInOut = (percentageComplete) => {
	if ( percentageComplete < 0.5 ) return Tween.Easing.Bounce.EaseIn( percentageComplete * 2 ) * 0.5;
	return Tween.Easing.Bounce.EaseOut( percentageComplete * 2 - 1 ) * 0.5 + 0.5;
};