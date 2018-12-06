const injectVM = function (VM) {

    VM.Scratch3RenderedTarget.prototype.startTracker = function (util) {
        if (this._spriteTracker && !util.stackFrame.executed) {
            util.stackFrame.executed = true;
            util.startProcedure(this._spriteTracker);
        }
    };

    VM.Scratch3MotionBlocks.prototype.moveSteps__ = VM.Scratch3MotionBlocks.prototype.moveSteps;
    VM.Scratch3MotionBlocks.prototype.moveSteps = function (args, util) {
        this.moveSteps__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.goToXY__ = VM.Scratch3MotionBlocks.prototype.goToXY;
    VM.Scratch3MotionBlocks.prototype.goToXY = function (args, util) {
        this.goToXY__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.goTo__ = VM.Scratch3MotionBlocks.prototype.goTo;
    VM.Scratch3MotionBlocks.prototype.goTo = function (args, util) {
        this.goTo__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.turnRight__ = VM.Scratch3MotionBlocks.prototype.turnRight;
    VM.Scratch3MotionBlocks.prototype.turnRight = function (args, util) {
        this.turnRight__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.turnLeft__ = VM.Scratch3MotionBlocks.prototype.turnLeft;
    VM.Scratch3MotionBlocks.prototype.turnLeft = function (args, util) {
        this.turnLeft__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.pointInDirection__ = VM.Scratch3MotionBlocks.prototype.pointInDirection;
    VM.Scratch3MotionBlocks.prototype.pointInDirection = function (args, util) {
        this.pointInDirection__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.pointTowards__ = VM.Scratch3MotionBlocks.prototype.pointTowards;
    VM.Scratch3MotionBlocks.prototype.pointTowards__ = function (args, util) {
        this.pointTowards(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.changeX__ = VM.Scratch3MotionBlocks.prototype.changeX;
    VM.Scratch3MotionBlocks.prototype.changeX = function (args, util) {
        this.changeX__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.setX__ = VM.Scratch3MotionBlocks.prototype.setX;
    VM.Scratch3MotionBlocks.prototype.setX = function (args, util) {
        this.setX__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.changeY__ = VM.Scratch3MotionBlocks.prototype.changeY;
    VM.Scratch3MotionBlocks.prototype.changeY = function (args, util) {
        this.changeY__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3MotionBlocks.prototype.setY__ = VM.Scratch3MotionBlocks.prototype.setY;
    VM.Scratch3MotionBlocks.prototype.setY = function (args, util) {
        this.setY__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3LooksBlocks.prototype.switchCostume__ = VM.Scratch3LooksBlocks.prototype.switchCostume;
    VM.Scratch3LooksBlocks.prototype.switchCostume = function (args, util) {
        this.switchCostume__(args, util);
        util.target.startTracker(util);
    };

    VM.Scratch3LooksBlocks.prototype.nextCostume__ = VM.Scratch3LooksBlocks.prototype.nextCostume;
    VM.Scratch3LooksBlocks.prototype.nextCostume = function (args, util) {
        this.nextCostume__(args, util);
        util.target.startTracker(util);
    };
};

export default injectVM;
