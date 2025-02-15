ServerEvents.recipes((event) => { 

    //Replacing Timber Frame Recipe to Avoid Recipe Conflicts
    event.replaceInput({ id: "supplementaries:timber_frame"}, '#c:rods/wooden', "#c:rods/treated_wood")

});
