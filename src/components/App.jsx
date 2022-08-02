import React from "react";
import { Card, Button } from '@mui/material';

const App = () => {
    return <React.Fragment>
        <h1>Hello Material UI!</h1>
        <Button>Look at some cards.</Button>
        <div>
            <Card>
                <img src="https://picsum.photos/id/237/200/300" alt="Test" />
                <h2>Card Title</h2>
                <Button>Card Button</Button>
            </Card>
        </div>
    </React.Fragment>;
};
