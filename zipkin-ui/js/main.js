import {compose, registry, advice, debug} from 'flightjs';
import crossroads from 'crossroads';
import initializeDefault from './page/default';
import initializeTrace from './page/trace';
import initializeDependency from './page/dependency';
import CommonUI from './page/common';
import loadConfig from './config';
import {errToStr} from './component_ui/error';

loadConfig().then(config => {
  debug.enable(true);
  compose.mixin(registry, [advice.withAdvice]);

  CommonUI.attachTo(window.document.body, {config});

  crossroads.addRoute('', () => initializeDefault(config));
  crossroads.addRoute('traces/{id}', traceId => initializeTrace(traceId, config));
  crossroads.addRoute('dependency', () => initializeDependency(config));
  crossroads.parse(window.location.pathname);
}, e => {
  // TODO: better error message, but this is better than a blank screen...
  const err = errToStr(e);
  document.write(`Error loading config.json: ${err}`);
});
