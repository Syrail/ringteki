import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');
import GameObject = require('../GameObject');

export interface MultipleActionProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class MultipleGameAction extends GameAction {
    effect = 'do several things';
    defaultProperties: MultipleActionProperties;

    constructor(gameActions: GameAction[]) {
        super({ gameActions: gameActions } as GameActionProperties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): MultipleActionProperties {
        let properties = super.getProperties(context, additionalProperties) as MultipleActionProperties;
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some(gameAction => gameAction.hasLegalTarget(context, additionalProperties));
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some(gameAction => gameAction.canAffect(target, context, additionalProperties));
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            if(gameAction.hasLegalTarget(context, additionalProperties)) {
                gameAction.addEventsToArray(events, context, additionalProperties);
            }
        }
    }
}
