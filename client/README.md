Value based AI
==============

This AI operates on multiple levels where higher levels try to kill enemies
while lower levels try to move the ship without being killed.


Über AI (TODO)
--------------

Used to identify good targets for the current friendly ship positions and
cluster those ships.


Cluster AI (TODO)
-----------------

### Attack

Knows it's target and a group of friendly ships from the Über AI. Tries to
attack the enemy by coordinated shots -- meaning a couple of shots passing near
the enemy at roughly the same time so the enemy has a hard time to avoid being
shot.

### Movement

It is especially hard for the enemy to avoid bullets if they are coming from
different directions and at close range. Thus the Cluster AI tries to form a
circle around the enemy at mid range. A too close distance would enable the
enemy to kill friendly ships too easy.


Commander AI (TODO)
-------------------

### Attack

The movement of the Commander AI is tighly coupled with it's aggressiv elements.
The commander is informed by the Cluster AI of an interval at which bullets
should hit the enemy for coordinated fire. The Commander AI first tries to to
get a clear vision for shooting -- no friendly ships in it's line of fire,
neigher in front of nor behind the enemy -- by manovering the ship. If the line
of fire is clear or friendly ships are distant enough to dodge the shots the
Commander AI times the firing so that all bullets of a cluster arrive at the
predicted enemy position at roughly the same time.

### Movement

While the attack motions are generally preferred


Survival AI
-----------

The Survival AI has no aggressive components. It's sole purpose is to keep the
ship alive by avoiding collisions with the game border or other ships and
dodging bullets.

